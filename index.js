//import dotenv
require('dotenv').config()

const mysql = require('mysql')

//import express
const express = require('express')

//import cors
const cors = require('cors')

//create server
const regServer = express()

//use of cors in server
regServer.use(cors())

//json to js object
regServer.use(express.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'signup'
})

//signup

regServer.post('/signup', (req, res) => {
    const sql = "INSERT INTO user (name,email,password) Values (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]
    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})


// login
regServer.post('/login', (req, res) => {
    const sql = "SELECT * FROM user WHERE email = ? AND password = ?";

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.json({ success: false, error: err });
        }
        if (data.length > 0) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: 'Incorrect email or password' });
        }
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


