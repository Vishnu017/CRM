import mysql from 'mysql2'

const pool=mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'root',
    database:'crm'
}).promise()

const result= await pool.query("SELECT * FROM customer")
console.log(result);