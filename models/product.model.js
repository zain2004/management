const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: Boolean,
    slug: {
        type: String,
        slug: ["title", "subtitle"],
        unique: true
    }
});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;