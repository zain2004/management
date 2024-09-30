const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: false
    });

    for (const item of products) {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
    }

    res.render("client/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: products 
    });
}

module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    const response = await Product.findOne({
        slug: slug,
        deleted: false
    });    
    res.render("client/pages/products/detail.pug", {
        pageTitle: "Trang chi tiết sản phẩm",
        product: response
    });
}