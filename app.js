const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/playerProfiles");


// create schema
const playerSchema = {
    name: String,
    age: Number,
    city: String
}


// create model
const Player = mongoose.model("Player", playerSchema);


// create new documents
const Penelope = new Player ({
    name: "Penelope",
    age: 23,
    city: "London"
});

const Joseph = new Player({
    name: "Joseph",
    age: 35,
    city: "Liverpool"
});

const Peter = new Player({
    name: "Peter",
    age: 77,
    city: "Peterborough"
});

const defaultPlayers = [Penelope, Joseph, Peter];

// insert documents into model
// Player.insertMany(defaultPlayers, function(err){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("Successfully saved default players to database!");
//     }
// })



app.get("/", function(req, res){
    Player.find({}, function(err, foundPlayers){
        if(foundPlayers.length === 0){
            Player.insertMany(defaultPlayers, function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("Successfully saved default players to database!");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Player Board", newListItems: foundPlayers});
        }
    })
});



app.post("/", function(req, res){
    const playerName = req.body.newPlayerName;
    const playerAge = req.body.newPlayerAge;
    const playerCity = req.body.newPlayerCity;

    const player = new Player({
        name: playerName,
        age: playerAge,
        city: playerCity
    });

    player.save();

    res.redirect("/");
});



app.post("/delete", function(req, res){
    const checkedPlayerId = req.body.checkbox;
    Player.findByIdAndRemove(checkedPlayerId, function(err){
        if(!err){
            console.log("Successfully removed player!");
        }
    })
    res.redirect("/");
});




app.listen(3000, function() {
    console.log("Server started on port 3000");
  });