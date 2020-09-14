var mongoose = require('mongoose'),
    Schema = mongoose.Schema


var ItemSchema = new Schema({
    itemID: { type: String, required: true, unique: true },
    productObjId: Schema.Types.ObjectId,
    manufacturedAt: { type: Date },
    expiresAt: { type: Date },
    rackNo: { type: String },
    shelfNo: { type: String },
    warehouseObjId: Schema.Types.ObjectId,
    transactions: [Schema.Types.ObjectId],
    issued:Boolean,
    isDefective:Boolean
});


module.exports = mongoose.model('Item', ItemSchema);