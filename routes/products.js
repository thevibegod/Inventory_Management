const router = require("express").Router()
const Product = require('../Schemas/products')
const Warehouse = require('../Schemas/warehouses')
const { v4: uuidv4 } = require('uuid')
const { set } = require("mongoose")

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




const dealWithWarehouseHandler = async (req, res) => {
    const set_operations = require('../set_operations')

    try {
        const { product_id, warehouse_ids, operation_type } = req.body
        console.log(warehouse_ids)
        const product = await Product.findOne({ productID: product_id })


        if (operation_type == "ASSIGN") {

            const existing_warehouse_set = new Set([...product.allowedWarehouses].map(elem => elem.toHexString()))
            const new_warehouse_set = new Set([...warehouse_ids])
            const union_set = set_operations.union(existing_warehouse_set, new_warehouse_set)
            let new_warehouses = Array.from(union_set)
            product.allowedWarehouses = new_warehouses


        } else if (operation_type == "RESIGN") {
            let allowed_warehouses = new Set([...product.allowedWarehouses].map(elem => elem.toHexString()))
            let warehouses_to_remove = new Set(warehouse_ids)
            if (!set_operations.isSuperset(allowed_warehouses, warehouses_to_remove)) {
                throw 'The requested warehouses contain some outbound elements.'
            }

            allowed_warehouses = Array.from(set_operations.difference(allowed_warehouses, warehouses_to_remove))
            product.allowedWarehouses = allowed_warehouses
        } else {
        }

        const saved_product = await product.save()

        return res.status(200).json({
            success: true,
            message: 'product updated successfully. Data contains the modified product',
            data: {
                product: saved_product
            }
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

router.route("/warehouse_action/")
    .post(dealWithWarehouseHandler)

module.exports = router
