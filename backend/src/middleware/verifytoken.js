import jwksClient from 'jwks-rsa';
import jwt from "jsonwebtoken";

const client = jwksClient({
    jwksUri: 'http://localhost:8080/realms/MyRealm/protocol/openid-connect/certs',
    cache: true,   
    cacheMaxEntries: 5,
    cacheMaxAge: 3600000,
    timeout: 5000
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            return callback(err);
        }
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}

export function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Token missing');
    }
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        req.user = decoded;
        next();
    });
}
