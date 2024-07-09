const express = require("express");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const Users=[];






app.post("/api/register", async(req, res) => {
  const { name, email,password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send("Name, Email and Password are required");
  }

  const salt=await bcrypt.genSaltSync(10);

  const user={
    name,
    email,
    password:await bcrypt.hashSync(password,salt)
  };
   
  const token=jwt.sign(user,"e67y4vfhfdgyudfdguffh",(err,user)=>{
    if(err){
      return res.status(400).send("Token not generated");
    }
    return token;
  })
    Users.push(user);
    console.log(Users);

   res.status(200).json({user,token});
  

});

app.post("/api/login", async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("Email and Password are required");
    }
    
    const user=Users.find(user=>user.email===email);
    if(!user){
        return res.status(400).send("User not found");
    }
    const isCorrectPassword=await bcrypt.compare(password, user.password);
    if(!isCorrectPassword){
        return res.status(400).send("Password is incorrect");
    }
    
    res.status(200).send("Login Successfull");
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
