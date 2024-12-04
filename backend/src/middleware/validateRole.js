import jwt from "jsonwebtoken";

export function checkRoles(requiredRoles) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send('Unauthorized');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.decode(token, { complete: true });

        const userRoles = decoded.payload.realm_access?.roles || [];
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
            return res.status(403).send('Forbidden: Insufficient Role');
        }

        req.user = decoded;
        next();
    };
}