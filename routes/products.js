const router = require("express").Router()
const Product = require('../Schemas/products')
const { v4: uuidv4 } = require('uuid')

// Get product(s)
const read_handler = async (req, res) => {
    try {
        let query = {}

        if (req.query.id)
            query = { productID: req.query.id }

        let products = await Product.find(query)
        if (query.productID != undefined && products.length == 0) {
            return res.status(404).json({
                success: false,
                message: "No product found with such id."
            })
        }


        return res.status(200).json({
            success: true,
            message: "Products found",
            data: { products }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err
        })
    }


}


// Create a product
const create_handler = async (req, res) => {
    try {
        let {
            name,
            product_id: productID,
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

}



// Update a product
const update_handler = async (req, res) => {

    try {
        const productID = req.body.product_id

        let {
            name,
            category,
            sub_category: subCategory,
            weight,
            allowed_warehouse_ids: allowedWarehouses,
            is_expirable: isExpriable,
            expiry_period: expiryPeriod
        } = req.body

        let obj = {
            name,
            category,
            subCategory,
            weight,
            allowedWarehouses,
            isExpriable,
            expiryPeriod
        }


        let db_obj = {}
        for (let i in obj) {
            if (obj[i] != null || obj[i] != undefined) {
                db_obj[i] = obj[i]
            }
        }

        console.log(db_obj)

        let product = await Product.findOneAndUpdate({ productID: productID }, db_obj, { new: true })
        console.log(product)

        return res.status(202).json({
            success: true,
            message: "product successfully updated.",
            data: { product }
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err
        })
    }

}

// delete a product
const delete_handler = async (req, res) => {
    try {
        const product_id = req.query.id
        const deleted_product = await Product.findOneAndDelete({ productID: product_id })
        return res.status(202).json({
            success: true,
            message: "Product successfully deleted.",
            data: { product: deleted_product }
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err
        })
    }

}




router.route('/')
    .get(read_handler)
    .post(create_handler)
    .put(update_handler)
    .delete(delete_handler)

module.exports = router
