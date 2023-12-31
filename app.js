//jshint esversion:6
import 'dotenv/config'
import bodyParser from "body-parser";
import express from "express";
import pg from "pg";


const PORT = 3000;
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));


const db = new pg.Client({

    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port:process.env.DB_PORT
});
// console.log(process.env.DB_NAME);
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);
// console.log(process.env.DB_PORT);
// console.log(process.env.DB_HOST);
db.connect();
app.get("/", async (req,res) =>{
    const result = await db.query("SELECT * FROM user_login");
    
    // console.log(result.rows);
    res.render("home");
})

app.get("/register", (req,res) =>{
    
    res.render("register");
})


app.get("/login", (req,res) =>{
    res.render("login");
})

app.post("/register",  async (req,res)=>{
    const username = req.body.username;
    const password  = req.body.password;
    try {
       await db.query("INSERT INTO user_login(username, password) VALUES ($1,$2)",[username, password]);
       res.render("secrets");
    } catch (err) {
        console.log(err);
    }
})

app.post("/login", async (req, res)=>{
    const {username, password} = req.body;
    
    try {
        const data = await db.query("SELECT * from user_login where username=$1 and password = $2", [username, password]);
        // const result = data.rows;
        // const getPass = result[0].password;
        // if (getPass == password){
        //     res.render("secrets");
        // }else{
        //     res.render("login");
        // }
        if( data.rows.length === 1){
            res.render("secrets");
        }else{
            res.redirect("/login");
        }

        
    } catch (err) {
        console.log(err);
    }

    // console.log(`Username is ${username} password is ${password}`);
})

app.get("/logout", (req,res)=>{
    res.redirect("/");
});



app.listen(PORT, () =>{
    console.log(`App listening on port : ${PORT}`);
})