import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const pool=mysql.createPool({
    host:process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
}).promise()

export async function getOut() {       //get complete table
    const [rows]= await pool.query("SELECT * FROM customer")
    return rows;
}

export async function getOrder() {       //get complete table
    const [x]= await pool.query("SELECT * FROM orders")
    return x;
}

export async function get1(id) {           //get data from id
    const [rows]= await pool.query(`
        SELECT *
        FROM customer
        WHERE id=?
        `,[id]
    )   
    return rows[0]
    
}
export async function get2(order_id) {           //get data from id
    const [rows]= await pool.query(`
        SELECT *
        FROM orders
        WHERE order_id=?
        `,[order_id]
    )
    return rows[0]
    
}

//insert function
export async function createNew(name,email,phone,address) {
    const result=await pool.query(`
        INSERT INTO customer(name,email,phone,address)
        VALUES(?,?,?,?)
        `,[name,email,phone,address]
    )
    const id=result.insertId
    return get1(id)
}
export async function createNewOrder(customer_id,product_name,quantity,price,order_status) {
    const [result]=await pool.query(`
        INSERT INTO orders(customer_id,product_name,quantity,price,order_status)
        VALUES(?,?,?,?,?) 
        `,[customer_id,product_name,quantity,price,order_status]
    )
    const newOrd=result.insertId
    return get2(newOrd)
}
// //to insert
// const result= await createNew('dhruv','hello@gmail.com','1234','qwe')
// console.log(result);

//to get output
const out = await get2()
console.log(out);
