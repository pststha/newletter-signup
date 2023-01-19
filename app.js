const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('node:https');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/sign-up.html")
})

app.post('/',(req,res)=>{
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    var data ={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:fname,
                    LNAME:lname
                }
            }
        ]
    }
    var jsonDATA = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/de8adeb528";
    const options={
        method:"POST",
        auth:"pst:2f9fda651142787c739b3149be46e551-us21"
    }
    const request = https.request(url, options, (response)=>{
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",(data)=>{
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonDATA);
    request.end();
})

app.post("/failure",(req,res)=>{
    res.redirect('/');
})

app.post("/success",(req,res)=>{
    res.redirect('/')
})

app.listen(process.env.PORT || 3000,()=>{
    console.log("server running at port 3000");
})
// 2f9fda651142787c739b3149be46e551-us21    mailchimo api key
// de8adeb528 list id

