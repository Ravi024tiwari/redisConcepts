import {Worker} from "bullmq"
import {connection} from "./queue.js"



const worker = new Worker(
    "emails",
     
    async(job)=>{
        console.log("processing email job...",job.id,job.name,job.data);
        (await new Promise((resolve)=>setTimeout(resolve,1500)),
            console.log("Email job completed!",job.id,job.name,job.data));//here we get all the jobs complemet
    },
    {connection}
)


worker.on("completed",(job)=>{
    console.log("Job completed",job.id,job.name,job.data);
})

worker.on("failed",(job,err)=>{
    console.log("Job failed!",job.id, job.nam ,job.data,err);
})