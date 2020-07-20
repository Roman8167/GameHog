const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const path = require("path")
const urlencoded = bodyParser.urlencoded({extended:false})
const {checkAuthenticated} = require("../auth/auth")
const client = require("socket.io").listen(4000).sockets;
var userMessages = new Array()
var robotMessage = new Array();

router.get("/contact",checkAuthenticated,function(req,res){
  res.render("chat.ejs",{user:req.user.name})
  client.on("connection",(socket)=>{
    socket.emit("status","Welcome " + req.user.name + "!");
    socket.on("disconnect",function(){
      console.log("You have disconnected..")
      socket.broadcast.emit("leaveChat","User " + req.user.name +  ' has left the chat')
    })

  })
})
router.post("/askBot",urlencoded,function(req,res){
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const sessionId = uuid.v4();
/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(projectId = 'gamehog-hhgvth') {
  // A unique identifier for the given session
  

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({keyFilename:"C:/Users/GE62VR/Desktop/GameHog/GameHog-a43202542d46.json"});
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: req.body.textarea,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  
  userMessages.push({name:req.user.name,message:req.body.textarea});
  client.emit("userMessage",userMessages);
  robotMessage.push({robotMessage:result.fulfillmentText});
  client.emit("robotMessage",robotMessage)
}
runSample()
res.render("chat.ejs",{user:req.user.name})
})

module.exports = router