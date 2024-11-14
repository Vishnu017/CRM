import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const pool=mysql.createPool({
    host:process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
}).promise()

async function getOut() {
    const [rows]= await pool.query("SELECT * FROM customer")
    return rows;
}

const out = await getOut()
console.log(out);
