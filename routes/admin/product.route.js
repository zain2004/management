const express = require("express");
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`; 
      cb(null, fileName);
    }
  })
  
  const upload = multer({ storage: storage })

const controller = require("../../controllers/admin/product.controller.js");

const validate = require("../../validates/admin/product.validate.js");

router.get("/", controller.index);

router.patch("/change-status", controller.changedStatus);

router.patch("/change-multi", controller.changedMulti);

router.patch("/delete", controller.delete);

router.patch("/change-position", controller.changePosition);

router.get("/create", controller.createPage);

router.post("/create", upload.single('thumbnail'),validate.validateTitleOfProduct, controller.createProduct);

router.get("/edit/:id", controller.editPage);

router.patch("/edit/:id", upload.single('thumbnail'), validate.validateTitleOfProduct, controller.editProduct);

router.get("/detail/:id", controller.detail);

module.exports = router;