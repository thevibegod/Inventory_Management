var mongoose = require('mongoose'),
    Schema = mongoose.Schema

    transactionTypes = ['Stock Creation', 'Stock Deletion', 'Stock Issuance', 'Stock Transfer']
transactionStatuses = ['Initiated', 'Successful', 'Failure']
var TransactionSchema = new Schema({
    type: { type: String, required: true, enum: transactionTypes },
    status: { type: String, required: true, enum: transactionStatuses },
    from: { type: String },
    to: { type: String },
    createdAt: { type: Date, default: Date.now },
    issuedTill: { type: Date },
    involvedItems: [Schema.Types.ObjectId]
});


module.exports = mongoose.model('Transaction', TransactionSchema);