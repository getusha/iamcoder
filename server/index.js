import {createServer} from "http";
import express from "express";
import {Server} from "socket.io";
import mongoose from "mongoose";
import "dotenv/config"
const app = express();
app.use(express.json())
const httpServer = createServer(app);
var onlinePeoples = []; 
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB).then(()=>{
    io.listen(PORT, (ll)=>{
        console.log("Listening ")
    })
})

app.get("/creatAccount", (req, res)=>{
    res.send("Hello")
})
app.post("/creatAccount", (req, res)=>{
    console.log(req.body)
})
app.listen(3002)

const io = new Server(httpServer.Server, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});

const messageSchema = new mongoose.Schema({
    messageM: String,
    autor: String,
})

const userSchema = new mongoose.Schema({
    name: String,
    author: String
})

const Message = mongoose.model("Message", messageSchema);
const User = mongoose.model("User", userSchema);




function findAndSendAll(){
    Message.find({}, (err, result)=>{
        if(err){
            console.log(err)
        } else{
            result = result.slice(result.length-30,result.length)
            io.emit("newmessage", result)
        
        }
    })
}
findAndSendAll()
// setInterval(() => {
//     findAndSendAll();
// }, 2000);

// io.on("newmessage", (singleMessage, name)=>{
//     findAndSendAll();
//     new Message({messageM: singleMessage, author: "name"}).save((err)=>{
//         if(err){
//             console.log(err);
//         } else{
//             findAndSendAll()
//         }
//     });
//     // console.log(latestMessage)
// })


io.on("connection", (socket)=>{

    findAndSendAll();

    socket.on("newmessage", ({singleMessage, name})=>{
        new User({name: "Anonymous"}).save();
        new Message({messageM: singleMessage, author: "name"}).save((err)=>{
            console.log(err)
            if(err){
                console.log(err);
            } else{
        findAndSendAll();
            }
        });
        // console.log(latestMessage)
    })


    // console.log(socket.id + " User connected")
    
})
io.on("disconnect", (socket)=>{
    console.log("User left")
})

// io.listen(3001)