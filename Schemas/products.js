var mongoose = require('mongoose'),
    Schema = mongoose.Schema,


var ProductSchema = new Schema({
    name: { type: String, required: true },
    productID: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    weight: { type: Number, required: true },
    allowedWarehouses: [Schema.Types.ObjectId],
    isExpirable: { type: Boolean, default: false },
    expiryPeriod: { type: Number }
});


module.exports = mongoose.model('Product', ProductSchema);