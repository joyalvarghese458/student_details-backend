//import dotenv
require('dotenv').config()

const mysql = require('mysql')

//import express
const express = require('express')

//import cors
const cors = require('cors')

//bcrypt
const bcrypt = require('bcrypt')

//create server
const regServer = express()

//use of cors in server
regServer.use(cors())

//json to js object
regServer.use(express.json())



const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

//signup
const salt = 10;
regServer.post('/signup', (req, res) => {
    const sql = "INSERT INTO user (name,email,password) Values (?)";
    const password = req.body.password
    bcrypt.hash(password.toString(),salt,(err,hash)=>{
        if(err){
            console.log(err);
        }
        const values = [
            req.body.name,
            req.body.email,
            hash
        ]
        db.query(sql, [values], (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        })
    })
   
})


// login
regServer.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM user WHERE email = ?";    
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, error: 'Internal server error' });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ success: false, error: 'Incorrect email or password' });
        }

        const user = results[0];
        const hashedPassword = user.password;

        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (err) {
                console.error('bcrypt error:', err);
                return res.status(500).json({ success: false, error: 'Internal server error' });
            }

            if (result) {
                return res.json({ success: true });
            } else {
                return res.status(401).json({ success: false, error: 'Incorrect email or password' });
            }
        });
    });
});



//student details
regServer.post('/addstudent', (req, res) => {
    const add = "INSERT INTO student (idnum , firstname , lastname , dob , address , phone , email) values(?)"

    const sdatas = [
        req.body.idnum,
        req.body.firstname,
        req.body.lastname,
        req.body.dob,
        req.body.address,
        req.body.phone,
        req.body.email
    ]

    db.query(add, [sdatas], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })

})

//display
regServer.get('/lists', (req, res) => {
    const sql = "SELECT * FROM student";
    db.query(sql, (err, result) => {
        if (err) return res.json({ status: false, Error: "Query error" })
        return res.json({ status: true, Result: result })
    })
})

//edit
regServer.put('/edit/:id',(req,res)=>{
    const id = req.params.id;
    const sql = "UPDATE student SET idnum=?, firstname=?, lastname=?, dob=?, address=?, phone=?, email=? WHERE idnum=?"
    const Editdatas = [
        req.body.idnum,
        req.body.firstname,
        req.body.lastname,
        req.body.dob,
        req.body.address,
        req.body.phone,
        req.body.email,
        id
    ]
    db.query(sql,Editdatas,(err,result)=>{
        if(err) return res.json('error');
        return res.json(result)
    })
})

//delete
regServer.delete('/delete/:id',(req,res)=>{
    const id = req.params.id;
    const sql = 'DELETE FROM student WHERE idnum = ?';
    db.query(sql,[id],(err,result)=>{
        if (err) return res.json({message:'error'})
        return res.json(result)  
        
    })
})

//port
const PORT = 4000 || process.env

//run server
regServer.listen(PORT, () => {
    console.log('running successfully at ' + PORT);
})


regServer.get('/', (req, res) => {
    res.send('running get')
})


