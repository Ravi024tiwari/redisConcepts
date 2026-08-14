import express from "express"

import{emailQueue} from "./queue.js"

const app =express();

app.use(express.json())

app.post("/welcome-email",async(req,res)=>{
    // Logic to add a job to the qu
    const job = emailQueue.add("send-welcome-email",
        {
            to:req.body.to,
            name:req.body.name || "Learners"
        },
        {
            attempts:3,
            backoff:{
                type:"exponential",
                delay:1000
            }
        }
    )

    res.json({message:"Welcome email job added to the queue",jobId:job.id})
})

app.listen(3000,(req ,res)=>{
    console.log(`Server is listening at port ${3000}`);
})

