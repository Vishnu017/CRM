import mysql from 'mysql2'
import dotenv from 'dotenv'
import { query } from 'express'

dotenv.config()

export const pool=mysql.createPool({
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
export async function createNewOrder(customer_id,product_name,amount,order_date) {
    const [result]=await pool.query(`
        INSERT INTO orders(customer_id,product_name,amount,order_date)
        VALUES(?,?,?,?) 
        `,[customer_id,product_name,amount,order_date]
    )
    const newOrd=result.insertId
    return get2(newOrd)
}

//conditions and segment creation
export async function buildSegmentQuery(segmentName){
    // Fetch conditions for the segment
    const [conditions] = await pool.query(
        'SELECT * FROM audience_conditions WHERE segment_name = ? ORDER BY id',
        [segmentName]
    );
    if (conditions.length === 0) {
        throw new Error('No conditions found for the specified segment.');
    }

    // Base query to calculate total spending, visits, and last visit
    let cal = `
        SELECT 
            c.id AS customer_id,
            c.name AS customer_name,
            SUM(o.amount) AS total_spending,
            COUNT(o.order_id) AS total_visits,
            MAX(o.order_date) AS last_visit
        FROM 
            customer c
        LEFT JOIN 
            orders o
        ON 
            c.id = o.customer_id
        GROUP BY 
            c.id   
    `;
    console.log(cal,"cal")
// conditions=id,name,json   array of objects
//json conditions[0].conditions_json
// total_spending>10000
//{ key: 'total_spending', value: 10000, operator: '>' }s
// `${obj.key} ${obj.operator} ${obj.value}`

    let whereClauses = conditions.map((cond) => {
        
    //    console.log(`${conditions[0].conditions_json.operator}`, "obj")
    //     console.log(cond.conditions_json.value, "cond")
        return `(${cond.conditions_json.key}${cond.conditions_json.operator}${cond.conditions_json.value})`;
    }).join(' AND ');
    // console.log(conditions_json)
    // console.log(conditions[0].conditions_json, "conditions_json")

    // console.log(conditions[0].conditions_json)   

    // Final query with conditions
    let finalQuery = `${cal} HAVING ${whereClauses}`;
console.log(finalQuery,"final")
return finalQuery
//     let [rows]=await pool.query(finalQuery);
// console.log(rows,"query")
//     return {rows}; 
};

export async function camps(segment_id) {
    const [rows]= await pool.query(`
        SELECT *
        FROM campaignTable
        WHERE segment_id=?
        `,[segment_id]
    )
    return rows
}

export async function getCamps() {       //get complete table
    const [y]= await pool.query("SELECT * FROM campaignTable")
    console.log(y)
    return y;
}


