import express from "express"
import Redis from "ioredis"

const app =express();
const redis =new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(express.json());


function otpKey(phone){
    return `otp:${phone}`;
}


app.post('/otp',async(req ,res)=>{
    const {phone} =req.body;

    const otp =Math.floor(100000 +Math.random()*900000).toString();

    await redis.set(otpKey(phone),otp,'EX',30) // otp valid for 30 sec

    res.json({message:'otp sended successfully',otp})
});



app.post('/otp/verify',async(req ,res)=>{
    const {phone ,otp} =req.body;

    const storedOTP =await redis.get(otpKey(phone));

    if(!storedOTP){
        return res.status(400).json({
            message:"OTP expired.. please generate new otp.."
        })
    }

    if(storedOTP === otp){
        await redis.del(otpKey(phone)); // remove otp after verification
        res.json({message:'otp verified successfully'});
    }
    else{
        res.status(400).json({message:'otp is invalid or expired'});
    }
});

app.get("/otp/:phone/ttl",async(req,res)=>{
    const {phone} =req.params;//here we get that phoe from that 
    const ttl = await redis.ttl(otpKey(phone));// here we fetch the ttl o fetch the otp from that 
    if(!ttl){
        return res.json({message:'otp is expired'});
    }
    return res.json({ttl}); // 
})


app.listen(3000,()=>{
    console.log('server started on port: 3000');
})