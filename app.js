require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});




const userSchema = new mongoose.Schema ({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });
const User = new mongoose.model("User",userSchema);

app.post("/register",function(req,res) {
  const newUser = new User( {
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if(err)
    console.log(err);
    else
    res.render("secrets");
  });
});

app.post("/login",function(req,res) {
  const email = req.body.username;
  const pwd = req.body.password;
  User.findOne({email:email},function(err,result) {
    if(err)
    console.log(err);
    else {
      if(result) {
        if(result.password===pwd)
        res.render("secrets");
      }
    }
  });
});

app.get("/",function(req,res) {
  res.render("home");
});
app.get("/login",function(req,res) {
  res.render("login");
});
app.get("/register",function(req,res) {
  res.render("register");
});


app.listen(3000,function() {
  console.log("Server started");
})
