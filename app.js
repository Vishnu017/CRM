import express from 'express'
import {getOut,get1,createNew} from './database.js'
const app= express()

app.get("/", async (req,res) =>{
    const cust=await getOut()
    res.send(cust)
})

app.listen(3000,() =>{
    console.log('Server is running on port 3000')
})