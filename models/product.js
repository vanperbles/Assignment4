var mongoose = require('mongoose');

let Schema = mongoose.Schema;

ProductSchema = new Schema({
    asin:{type: String, require: true},
    title:{type: String, require: true},
    imgUrl:{type: String },
    stars:{type: Number},
    reviews:{type: String},
    price:{type: Number},
    listPrice:{type: Number},
    categoryName:{type: String},
    isBestSeller:{type: String},
    reviews:{type: String},
    boughtInLastMonth:{type: String},
});

module.exports = mongoose.model('Product', ProductSchema);