import express from 'express'
import cors from 'cors'
import {getOut,get1,createNew} from './database.js'
const app= express()

app.use(cors());     //to accept api requests

app.use(express.json())


//to get json output on the page
// app.get("/play", async(req,res)=>{
//     console.log("byeee")
//     res.json({message:"heellllooo"});
// });

//get all
app.get("/", async (req,res) =>{
    const cust=await getOut()
    res.json(cust)
})

//get by id 
app.get("/:id", async (req,res) =>{
    const id=req.params.id
    const byId=await get1(id)
    res.send(byId)
})


//post req
app.post("/add",async(req,res)=>{
    const {name,email,phone,address}= req.body
    const newCust=await createNew(name,email,phone,address)
    res.status(201).send(newCust)
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
  
app.listen(8080,() =>{
    console.log('Server is running on port 8080')
})