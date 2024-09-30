const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const trashRoute = require("./trash.router");

const systemConfig = require("../../config/system");

module.exports.routeAdmin = (app) => {
  const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

  app.use(`${PATH_ADMIN}/dashboard`, dashboardRoute);

  app.use(`${PATH_ADMIN}/products`, productRoute);

  app.use(`${PATH_ADMIN}/trash`, trashRoute);
}