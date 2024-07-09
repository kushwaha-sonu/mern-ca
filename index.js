const express = require("express");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'yourDatabaseName'; // Replace with your actual database name
const client = new MongoClient(url);

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

app.get('/products/above/:minPrice', async (req, res) => {
  try {
    const minPrice = parseFloat(req.params.minPrice);
    if (isNaN(minPrice)) {
      return res.status(400).send('Invalid price value');
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('products');

    const query = { price: { $gt: minPrice } };
    const options = {
      sort: { price: -1 }, // Sort by price in descending order
    };

    const products = await collection.find(query, options).toArray();

    res.status(200).json(products);
  } catch (error) {
    console.error('Failed to retrieve products:', error);
    res.status(500).send('An error occurred while fetching products');
  } finally {
    await client.close();
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});





