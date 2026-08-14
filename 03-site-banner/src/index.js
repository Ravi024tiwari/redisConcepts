import express from "express"
import Redis from "ioredis"


const app =express()

app.use(express.json())

const redis =new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

const BANNER_KEY = "app:banner";// standered way to write the key in redis
//

app.post("/banner",async(req ,res)=>{
     await redis.set(BANNER_KEY,req.body.message ||"Welcome to chain aur Redis")

     res.json({success:true})
});

app.get("/banner",async (req,res)=>{
    const message = await redis.get(BANNER_KEY);

    // during fetching of res from redish we can explicity check that is it exit or not...

    res.json({message});
});

app.delete("/banner",async(req,res)=>{
     await redis.del(BANNER_KEY)

     res.json({success:true});
})

// check is the given key exit or not in the redis db not in the local app

app.get("/banneexistr/",async (req,res)=>{
    const exists = await redis.exists(BANNER_KEY);

    res.json({exists:Boolean(exists)});
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})

