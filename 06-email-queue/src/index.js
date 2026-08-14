import express from "express"
import Redis from "ioredis"

const app =express()

const redis =new Redis(process.env.REDIS_URL || 'redis://localhost:6379')


app.use(express.json());

const  QUEUE_KEY ='queue:emails';

app.post('/emails',async(req,res)=>{
    const job ={
        to :req.body.to,
        subject :req.body.subject ||'NO subject',
        body:req.body.body || 'No content',
        createdAt:new Date().toISOString()
    }

    await redis.lpush(QUEUE_KEY,JSON.stringify(job));

    res.json({message:'Email job enqueued successfully',job})
});

app.get("/emails/process-one",async(req ,res)=>{
    const rawJob =await redis.rpop(QUEUE_KEY)

    if(!rawJob){
        return res.status(404).json({
            message:"No job found in queue list"
        })
    }

    const job =JSON.parse(rawJob);//here we get that one json parse job
    
    res.status(200).json({
        success:true,
        message:"Fetched that process job",
        job
    })
})


app.listen(3000,(req ,res)=>{
    console.log('Server is listning on port 3000 ')
})