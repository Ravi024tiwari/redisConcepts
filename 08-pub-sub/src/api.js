// for the api we have the publisher to publish the events through the redis channel
import Redis from "redis"
import express from "express";


const app =express();
app.use(express.json());


const publisher = new Redis(process.env.REDIS_URL||"redis://localhost:6379");//here we make the publisher here

app.post("notifications", async(req ,res)=>{
    const payload ={
        title:req.body.title || "Default Title",
        createdAt:new Date().toISOString(),
    };

    const recivers = await publisher.publish("notifications",JSON.stringify(payload));//SEND THE PAYLOAD INTO STRING .... BY THE PUBLISHER

    res.json({
        message:`Notification sent to ${recivers} subscribers`
    });
})


app.listen(3000,()=>{
    console.log('Server is listenig on the port:',3000);
})