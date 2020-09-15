const router = require("express").Router()
const Product = require('../Schemas/products')
const { v4: uuidv4 } = require('uuid')

// Get product(s)
router.get('/', async (req, res) => {

})


// Create a product
router.post('/', async (req, res) => {
    try {
        let {
            name,
            prodcut_id: productID,
            category,
            sub_category: subCategory,
            weight,
            allowed_warehouse_ids: allowedWarehouses,
            is_expirable: isExpriable,
            expiry_period: expiryPeriod
        } = req.body

        const invalid = (elem) => {
            return elem == undefined || elem == null
        }

        productID = productID || uuidv4()


        if ([name, productID, category, subCategory, weight].some(invalid)) {
            return res.status(400).json({
                success: false,
                message: "One or some of name,product_id,cateogory,subCategory,weight are/is empty"
            })
        }

        if ((isExpriable && !expiryPeriod) || (isExpriable && expiryPeriod < 0)) {
            return res.status(400).json({
                success: false,
                message: "is_expirable and expiry_period fields are out of sync. (or) expiry_period is invalid"
            })
        }

        if (!isExpriable) {
            expiryPeriod = -1
        }

        const db_obj = {
            name, productID, category, subCategory, weight, allowedWarehouses, isExpriable, expiryPeriod
        }

        let product = new Product(db_obj)
        let saved_product = await product.save()

        return res.status(201).json({
            success: true,
            message: "Product saved successfully.",
            data: { saved_product }
        })


    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err
        })
    }

})


// Update a product
router.put('/', async (req, res) => {

})

// delete a product
router.delete('/', async (req, res) => {

})


module.exports = router