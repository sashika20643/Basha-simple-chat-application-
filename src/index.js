const express=require ("express")
const app=express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const {MongoClient} = require('mongodb');
const cors = require('cors');
var io = require('socket.io')(3001,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }});
app.use(cors({
    origin: '*'
}));
const uri = "mongodb+srv://sashika:DnQbd8BeR3CUcaj@cluster0.8nya5ng.mongodb.net/?retryWrites=true&w=majority";
const dbname = "chatapp";

const client = new MongoClient(uri);
app.use(express.json())
app.use(express.urlencoded({
    extended:false
}))

app.use(cookieParser());
 
app.use(session({
    secret: "chat",
    saveUninitialized: true,
    resave: true
}));
 
var db;
async function main(){
   
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log("Connected to database!");
         db = client.db(dbname);
        return db;
        // Make the appropriate DB calls
    
    } catch (e) {
        console.error(e);
    }
    }

main()




// Listen for the "join-chat-group" event from the client

  io.on("connection", function (socket) {
    socket.on("connectUser", function (userId,chatGroupId) {
        var chatGroupid=chatGroupId;
      socket.userId = userId;
      socket.join(chatGroupId);
      socket.broadcast.to(chatGroupId).emit("chat-message", userId+"join to the group");
      console.log(chatGroupId);
      console.log(userId);


      socket.on('chat-message', data => {
        console.log(data);
        socket.broadcast.to(chatGroupid).emit("chat-message", userId+":"+data);
      })
    });


    socket.on('typing', (username,cid) => {
        console.log(username + ' is typing');
        socket.broadcast.to(cid).emit('typing', username);
      });

  });

  

app.get("/",(req,res)=>{
    console.log( "fuck");
})
app.post("/register", async(req, res) => {
    var username= req.body.username
    console.log(username);

    const user = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: bcrypt.hashSync(req.body.password, 8),
      createon:new Date()
    };
  
    try {
        const userd=await db.collection("user").findOne({ username: username });
        if(userd){
            res.json({
                text:"invalid details",
                code:"404"
            }); 

        }
        else{
            console.log("no user found");
            db.collection("users").insertOne(user);
              console.log(user);
              res.json({
                  name:req.body.username,
                  code:"200"
              }); 
         


        }
    } catch (error) {
        console.log(error);
        res.json({
            text:"error",
            code:"400"
        }); 
    }

});

app.post("/login", async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  try {
   const user=await db.collection("user").findOne({ username: username });
   console.log(user); 
   if(user){
    if(!bcrypt.compareSync(password,user.password)){
        res.json({
            text:"invalid details",
            code:"404"
        }); 
    }
    else{   
        res.json({
            name:username,
            code:"200"
        }); 


     
    }
   }
   else{
    res.json({
        text:"invalid details",
        code:"404"
    });
   }
  
  } catch (error) {
    console.log(error);
  }
  
  });
  

app.listen(3000,()=>{
    console.log("port connected");
})