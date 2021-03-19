const mongoose = require('mongoose');

/**
 * Esquema(schema) do category
 */
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
    },
    icon: {
        type: String,
    },
})

/**
 * Passando o campo _id para id
 */
categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals: true,
});

/**
 * Criando o Model do category e exportando-o
 */
exports.Category = mongoose.model('Category', categorySchema);