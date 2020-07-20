const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/products";
const gameSchema = require("../models/gameSchema")
mongoose.connect(url,()=>{
    console.log("Connected to the productTable")
})
const newGames = [new gameSchema({
    imagePath:'https://s3.gaming-cdn.com/images/products/254/271x377/watch-dogs-cover.jpg',
    gameName:'Watch Dogs',
    description:'Watch Dogs is an action-adventure game, played from a third-person view',
    price:6.59,
    mode:"Single Player,Multiplayer",
    category:"Action-adventure game",
    operatingsystems:"Microsoft Windows,PlayStation 3,PlayStation4,Xbox 360,Xbox One,Wii U",
    rank:"Average",
    company:"Ubisoft",
    date:new Date("May 27, 2014")
}),
new gameSchema({
    imagePath:'https://s1.gaming-cdn.com/images/products/2325/271x377/tom-clancys-rainbow-six-siege-xbox-one-cover.jpg',
    gameName:"Tom Clancy's Rainbow Six Siege",
    description:"Tom Clancy's Rainbow Six Siege is a first-person shooter game",
    price:19.99,
    mode:"Single Player,Multiplayer",
    category:"Tactical shooter",
    operatingsystems:"Microsoft Windows,PlayStation 3,PlayStation4,Xbox 360,Xbox One",
    rank:"2nd most played games on Steam",
    company:"Ubisoft",
    date:new Date("December 1, 2015")
}),
new gameSchema({
    imagePath:'https://s3.gaming-cdn.com/images/products/4211/271x377/grand-theft-auto-v-premium-online-edition-cover.jpg',
    gameName:"GTA 5",
    description:"Grand Theft Auto V is an action-adventure game played from either a third-person or first-person perspective",
    price:59.99,
    mode:"Single Player,Multiplayer",
    category:"Tactical shooter",
    operatingsystems:"Microsoft Windows,PlayStation 3,PlayStation4,Xbox 360,Xbox One",
    rank:"11th most played games on Steam",
    company:"Rockstar Games",
    date:new Date("September 17, 2013")
}),
new gameSchema({
    imagePath:'https://s2.gaming-cdn.com/images/products/442/271x377/minecraft-cover.jpg',
    gameName:"Minecraft",
    description:"Minecraft is a Lego style adventure game which has massively increased in popularity since it was released two years ago",
    price:30,
    mode:"Single Player,Multiplayer",
    category:"Survival",
    operatingsystems:"Microsoft Windows,Linux,PlayStation 3,PlayStation 4,Nitendo,PSP,MacOs",
    rank:"4th most played games on Steam",
    company:"Mojang",
    date:new Date("May 17, 2009")
}),

];
var done = 0;
for(var i=0;i<newGames.length;i++){
    newGames[i].save(function(err,result){
        if(err) throw err;
        if(done==newGames.length){
            mongoexit()
        }
    })
}
function mongoexit(){
    mongoose.disconnect()
}
