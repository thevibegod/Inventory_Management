const express = require('express');
const cors = require('cors')
const db = require('./db/config');
const bodyParser = require('body-parser');
const warehouses = require('./routes/warehouses');
const products = require('./routes/products')

const app = express();
app.use(cors())

app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({}))
app.use('/warehouses', warehouses)
app.use('/products', products)
app.get('/', (req, res) => {
    res.send('Hello  World');
})
app.listen(3000, () => { console.log('Server up') });