import express from "express" 
import Redis from "ioredis"

const app =express()

const redis =new Redis(process.env.REDIS_URL ||"redis://localhost:6379")






app.listen(3000,(req,res)=>{
    console.log(`Server is listening at port :${process.env.PORT||3000}`)
})
