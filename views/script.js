var userMessages = document.getElementById("userMessages");
var robotMessages = document.getElementById("robotMessages");
var quitButton = document.getElementById("quitButton");
var leaveChat = document.getElementById("leaveChat")
var Status = document.getElementById("status");
var button = document.getElementById("button");
var askBot = document.getElementById("askBot");
var leaveButton = document.getElementById("leaveButton");
var leaveStatus = document.getElementById("leaveStatus")
var socket  = io.connect("http://127.0.0.1:4000");
if(socket!==undefined){
    console.log("Connected to Socket.IO");
    socket.on("status",function(data){
       Status.innerHTML = data 
       setTimeout(function(){
           Status.innerHTML = ''
       },2000)
    })
    socket.on("userMessage",function(data){
        if(data.length){
            for(var i=0;i<data.length;i++){
                var message = document.createElement("div");
                message.setAttribute("class","chat-message");
                message.innerHTML = "<i class = 'fas fa-user'></i>" + `<span class = 'badge badge-light'>${data[i].name}</span>` + `<span class = 'badge badge-success'>${data[i].message}</span>`;
                userMessages.appendChild(message);
                userMessages.insertBefore(message,userMessages.lastChild)
            }
        }
    });
    socket.on("robotMessage",function(data){
        if(data.length){
            for(var i=0;i<data.length;i++){
                var robotMessage= document.createElement("div");
                robotMessage.setAttribute("class","robot-message");
                robotMessage.innerHTML = "<i class = 'fas fa-robot'></i>" + `<span class = 'badge badge-light'>${data[i].robotMessage}</span>`
                robotMessages.appendChild(robotMessage);
                robotMessages.insertBefore(robotMessage,robotMessages.lastChild)
            }
        }
    })
}
socket.on("leaveChat",function(data){
    Status.innerHTML = data;
    setTimeout(function(){
        Status.innerHTML = ''
    },2000)
})