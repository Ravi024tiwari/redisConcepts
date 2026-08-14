import Redis from "ioredis"

const subscriber =new Redis(process.env.REDIS_URL || "redis://localhost:6379");

subscriber.subscribe("notifications",(err)=>{
    if(err){
        console.log("Failed to subscribe %s",err.message);
        return;
    }
    console.log("Subscribe successfully..");//here the new subscriber will added on the redis to get notify by the publisher
})

//here we will listen the events from the subscribers
// the message getting from the channel that creatd by the redis channel
subscriber.on("message",(channel,message)=>{
    console.log(`Received message from ${channel}:${JSON.parse(message)}`)
})



