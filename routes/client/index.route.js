const homeRoute = require("./home.route");
const productRoute = require("./product.route");


module.exports.routeClient = (app) => {
    app.use("/", homeRoute);
    
    app.use("/products", productRoute);
}