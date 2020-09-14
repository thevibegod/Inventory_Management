var mongoose = require('mongoose'),
    Schema = mongoose.Schema


var WarehouseSchema = new Schema({
    name: { type: String, required: true },
    warehouseID: { type: String, required: true, unique:true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    manager: Schema.Types.ObjectId,
    gatekeeper: Schema.Types.ObjectId
});


module.exports = mongoose.model('Warehouse', WarehouseSchema);