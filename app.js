//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

console.log(process.env.API_KEY);

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret =process.env.SECRET;
userSchema.plugin(encrypt, {secret:secret, encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);


app.get("/", (req, res)=>{
  res.render("home.ejs");
})


app.get("/login", (req, res)=>{
  res.render("login.ejs");
})

app.get("/register", (req, res)=>{
  res.render("register.ejs");
})

// Post request from regester page

app.post("/register", (req,res)=>{
  const email = req.body.username;
  const password = req.body.password;

  const user = new User({
    email:email,
    password:password
  });
  user.save(function(err){
    if(!err){
      res.render("secrets.ejs")
    }else{
      console.log(err);
    }
  });

})

app.post("/login", (req,res)=>{
  const email = req.body.username;
  const password = req.body.password;

  User.findOne({email:email}, function(err, user){
    if(err || user === null){
      res.redirect("/register");
    }else{
      if(user.password === password ){
        res.render("secrets.ejs");
      }else{
        res.redirect("/login");
      }
    }
  })
})


app.listen(3000, ()=>{
  console.log("Server is hot!");
})
