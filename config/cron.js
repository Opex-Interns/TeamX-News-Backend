import cron from "cron"
import https from "https"
import dotenv from "dotenv"

dotenv.config()


const job = new cron.CronJob("*/14 * * * *", function (){
https.get(process.env.API_URL,(response)=>{
    if(response.statusCode === 200){
        console.log("cron job is running")
    }

    else{
        console.log("cron job is not running")
    }
})
.on("error",(error)=>{
    console.error("error while sending request",error)
})
})

export default job