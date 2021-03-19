const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
})


/**
 * Passando o campo _id para id
 */
orderItemSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderItemSchema.set('toJSON', {
    virtuals: true,
});

/**
 * Criando o Model do product e exportando-o
 */
exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);