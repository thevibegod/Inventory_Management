const express = require('express');
const db = require('./db/config');
const bodyParser = require('body-parser');
const warehouses = require('./routes/warehouses');

const app = express();
app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({}))
app.use('/warehouses',warehouses)
app.get('/',(req,res)=>{
    res.send('Hello  World');
})
app.listen(3000,()=>{console.log('Server up')});