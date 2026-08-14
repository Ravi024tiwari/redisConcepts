import express from "express"
import Redis from "ioredis"

const app =express();

app.use(express.json());

const redis =new Redis(process.env.REDIS_URL ||'redis://localhost:6379');


app.post("/user/:id/json",async(req,res)=>{

    await redis.set(`user ${req.params.id}` ,JSON.stringify(req.body));

    return res.status(200).json({message:"user added"})
})


app.get("/user/:id/get",async(req,res)=>{
    const key =`user ${req.params.id}`;

    if(!key){
        return res.status(404).json({
            success:false,
            message:'User not found..'
        })
    }

    const raw = await redis.get(key);//here ew pass the key to the redis to get that value
    res.status(200).json({
        message:'User fetched successfully',
        user :raw?JSON.parse(raw):null
    })
})


//now i want to store the object in the redis as a object not in the form of string

app.post("/user/:id/hash",async(req,res)=>{
    await redis.hset(`user:${req.params.id}:hash`,req.body);//here not need to stringfy the value inside the hset it store in the form of hset
    res.json({savedAs:"hash data in redis" })
})

// now i want to get that hash data from the redis not the string store key value

app.get("/user/:id/hash",async(req,res)=>{
   const user = await redis.hgetall(`user:${req.params.id}:hash`);//here we pass only the key to get the value from the redish data structure

    res.json({user})
}) 
 

app.listen(3000,()=>{
    console.log('app is listening on port 3000')
})