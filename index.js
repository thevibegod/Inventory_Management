const express = require('express');
const db = require('./db/config');
const users = require('./Schemas/users');
const app = express();
app.get('/',(req,res)=>{
    res.send('Hello  World');
})

app.listen(3000,()=>{console.log('Server up')});