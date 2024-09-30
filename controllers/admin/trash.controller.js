const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: true
    });

    res.render("admin/pages/trash/index.pug", {
        pageTitle: "Thùng rác",
        products: products
    });
}