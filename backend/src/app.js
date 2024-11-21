import express from 'express'
import cors from 'cors'
import {getOut,get1,createNew,get2,getOrder,getCamps,createNewOrder,buildSegmentQuery,pool,camps} from './database.js'
const app= express()

app.use(cors());     //to accept api requests

app.use(express.json())


//to get json output on the page
// app.get("/play", async(req,res)=>{
//     console.log("byeee")
//     res.json({message:"heellllooo"});
// });

//get all
app.get("/", async (req, res) => {
    console.log( process.env.MYSQL_HOST,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    process.env.MYSQL_DATABASE)
    const cust=await getOut()
    res.json(cust)
})
app.get("/orders", async (req,res) =>{
    const ord=await getOrder()
    res.json(ord)
})
app.get("/campaigns", async (req,res) =>{
    const cam=await getCamps()
    res.json(cam)
})


//get by id 
app.get("/:id", async (req,res) =>{
    const id=req.params.id
    const byId=await get1(id)
    res.send(byId)
});
app.get("/orders/:id", async (req,res) =>{
    const order_id=req.params.id
    const byId1=await get2(order_id)
    res.send(byId1)
})

app.get("/campaigns/:segment_id",async(req,res)=>{
    const seg=req.params.segment_id
    const segId=await camps(seg)
    res.send(segId)
})


//post req
app.post("/add",async(req,res)=>{
    const {name,email,phone,address}= req.body
    const newCust=await createNew(name,email,phone,address)
    res.status(201).send(newCust)
})
app.post("/orders/add",async(req,res)=>{
    const {customer_id,product_name,amount,order_date}= req.body
    const newOrd=await createNewOrder(customer_id,product_name,amount,order_date)
    res.status(201).send(newOrd)
})


//error handling
app.use((err, req, res, next)=> {
    if (res.headersSent) {
      return next(err)
    }
    res.status(500)
    res.render('error', { error: err })
  }
)
// app.get('/segment', async(req,res)=>{
//     const seg1=req.params
// })

app.get('/segment/:segmentName', async (req, res) => {
    const { segmentName } = req.params;

    try {
        const x = await buildSegmentQuery(segmentName);
        console.log(x);
        const [results] = await pool.query(x);
        console.log(results,"results")
        res.json({ segmentName, results });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

app.get("/campaigns/segment/:segment_id", async(req,res)=>{
    console.log("hello")
    const {segment_id}=req.params;

    const cal=`
        select c.customer_id,
        cam.campaign_id
        from
        customer_segment c
        inner join
        campaignTable cam
        on c.segment_id=cam.segment_id
        where c.segment_id=?
    `;
    const [ans]=await pool.query(cal,[segment_id]);
    console.log(ans,"ams")
    res.json({success:true , data:ans})
})

app.post("/comm",async(req,res)=>{
    const {segment_id,message}=req.body
    const ans = `
            SELECT c.customer_id, cam.campaign_id
            FROM customer_segment c
            INNER JOIN campaignTable cam
            ON c.segment_id = cam.segment_id
            WHERE c.segment_id = ?`;
        
        const [results] = await pool.query(ans, [segment_id]);
        const logQuery = `
            INSERT INTO communications_log (customer_id, campaign_id, com_status)
            VALUES (?, ?, ?)`;

        for (const { customer_id, campaign_id } of results) {
            await pool.query(logQuery, [customer_id, campaign_id, message]);
        }

        res.json({
            success: true,
            message: "Messages have been successfully logged in the communication log."
        });
})


app.listen(8080,() =>{
    console.log('Server is running on port 8080')
})

