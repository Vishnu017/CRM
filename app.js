import express from 'express'
import {getOut,get1,createNew} from './database.js'
const app= express()

app.use(express.json())
//get all
app.get("/", async (req,res) =>{
    const cust=await getOut()
    res.send(cust)
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
app.listen(3000,() =>{
    console.log('Server is running on port 3000')
})