const Warehouse = require('../schemas/warehouses');
const { v4: uuidv4 } = require('uuid');
const router = require('express').Router()


router.post('/', (req, res) => {
    let id;
    if (!req.body.id) {
        id = uuidv4();
    }
    else {
        id = req.body.id;
    }
    let [name, address, city] = [req.body.name, req.body.address, req.body.city]

    new Warehouse({ name: name, address: address, city: city, warehouseID: id }).save().then((data) => res.status(201).json({ success: true, message: 'Warehouse Created.', data: data })).catch(
        err => res.status(500).json({ success: false, message: err })
    )

});

router.get('/', (req, res) => {
    if (req.query.id) {
        Warehouse.findOne({ warehouseID: req.query.id }).then(data => res.status(200).json({ success: true, data: data })).catch(
            err => res.status(400).json({ success: false, message: err })
        )
    } else {
        Warehouse.find({}).then(data => res.status(200).json({ success: true, data: data })).catch(
            err => res.status(400).json({ success: false, message: err })
        )
    }
});

router.put('/', (req, res) => {
    if (!req.query.id) {
        res.status(400).json({ success: false, message: "No id specified" })
    }
    Warehouse.findOneAndUpdate({ warehouseID: req.query.id }, { city: req.body.city, address: req.body.address, name: req.body.name }, { new: true }).then((data) =>{
    if (data) {
        return res.status(200).json({ success: true, message: 'Warehouse Updated.', data: data })
    }
    return res.status(400).json({ success: false, message: 'No Warehouse Found.' })
}).catch(
        err => res.status(500).json({ success: false, message: err })
    )
})
router.delete('/', (req, res) => {
    if (!req.query.id) {
        res.status(400).json({ success: false, message: "No id specified" })
    }
    Warehouse.findOneAndDelete({ warehouseID: req.query.id }).then((data) =>{
    if (data) {
        return res.status(200).json({ success: true, message: 'Warehouse Deleted.', data: data })
    }
    return res.status(400).json({ success: false, message: 'No Warehouse Found.' })
}).catch(
        err => res.status(500).json({ success: false, message: err })
    )
})

module.exports = router;