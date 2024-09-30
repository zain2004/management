const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  };

  //Lọc theo trạng thái
  if (req.query.status) {
    find.status = req.query.status;
  }
  //Hết lọc theo trạng thái

  //Tìm kiếm
  if (req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i");
    find.title = regex;
  }
  // Hết tìm kiếm

  //Phân trang
  let limtItem = 4;
  let page = 1;

  if (req.query.page) {
    page = req.query.page;
  }

  if (req.query.limit) {
    limtItem = req.query.limit;
  }

  const skip = (page - 1) * limtItem;
  // Hết phân trang

  //Đếm số trang
  const amoutOfItems = await Product.countDocuments(find);
  const amoutOfPages = Math.ceil(amoutOfItems / limtItem);
  //Hết đếm số trang

  //Sắp xếp theo vị trí
  let sort = "desc";
  if (req.query.sort) {
    sort = req.query.sort;
  }
  //Hết sắp xếp theo vị trí

  const products = await Product
    .find(find)
    .limit(limtItem)
    .skip(skip)
    .sort({ position: `${sort}` });

  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    pages: amoutOfPages,
    currentPage: page,
    skip: skip
  });
};

module.exports.changedStatus = async (req, res) => {
  try {
    const id = req.body.id;
    const status = req.body.status;
    const response = await Product.updateOne({
      _id: id,
    },
      {
        status: status
      });
    req.flash('success', 'Đổi trạng thái thành công!');
    res.json({
      code: "success"
    });
  } catch (error) {
    console.log(error);
    req.flash('unsuccess', 'Đổi trạng thái thất bại!');
    res.json({
      code: "unsuccess",
    });
  }
};

module.exports.changedMulti = async (req, res) => {
  try {
    const ids = req.body.ids;
    const status = req.body.status;
    let message;
    if (status == 'delete') {
      const response = await Product.updateMany({
        _id: ids
      },
        {
          deleted: true
        });
      message = "Xóa nhiều sản phẩm thất bại!"
    } else {
      const response = await Product.updateMany({
        _id: ids
      },
        {
          status: status
        });
      message = "Đổi trạng thái nhiều sản phẩm thành công!"
    }
    req.flash('success', message);
    res.json({
      code: "success"
    })
  } catch (error) {
    console.log(error);
    req.flash('unsuccess', "Thay đổi trên nhiều sản phẩm thất bại!");
    res.json({
      code: "unsuccess"
    });
  }
}

module.exports.delete = async (req, res) => {
  try {
    const id = req.body.id;
    const response = await Product.updateOne({
      _id: id
    },
      {
        deleted: true
      });
    req.flash('success', "Xóa sản phẩm thành công!");
    res.json({
      code: "success"
    });
  } catch (error) {
    console.log(error);
    req.flash('unsuccess', "Xóa sản phẩm thất bại!");
    res.json({
      code: "unsuccess"
    });
  }
}

module.exports.changePosition = async (req, res) => {
  try {
    const id = req.body.id;
    const position = parseInt(req.body.position);
    const response = await Product.updateOne({
      _id: id
    }, {
      position: position
    })
    req.flash("success", "Thay đổi vị trí thành công!");
  } catch (error) {
    req.flash("unsuccess", "Thay đổi vị trí thất bại!");
  } finally {
    res.json({
      code: "completed"
    });
  }
}

// module.exports.delete = async (req, res) => {
//   try {
//     // const id = req.body.id;

//     // Validate if the provided id is a valid MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       req.flash('unsuccess', "ID sản phẩm không hợp lệ!");
//       return res.json({
//         code: "unsuccess",
//         message: "Invalid product ID"
//       });
//     }

//     // Soft delete the product by setting 'deleted' to true
//     const response = await Product.updateOne(
//       { _id: id },
//       { deleted: true }
//     );

//     if (response.nModified === 0) {
//       req.flash('unsuccess', "Không tìm thấy sản phẩm hoặc không thể xóa!");
//       return res.json({
//         code: "unsuccess",
//         message: "Product not found or already deleted"
//       });
//     }

//     req.flash('success', "Xóa sản phẩm thành công!");
//     res.json({
//       code: "success"
//     });

//   } catch (error) {
//     console.log(error);
//     req.flash('unsuccess', "Xóa sản phẩm thất bại!");
//     res.json({
//       code: "unsuccess",
//       message: error.message
//     });
//   }
// }

module.exports.createPage = (req, res) => {
  res.render(`${systemConfig.prefixAdmin}/pages/products/create`, {
    pageTitle: "Thêm mới sản phẩm"
  });
}

module.exports.createProduct = async (req, res) => {
  if (req.body) {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countRecord = await Product.countDocuments();
      req.body.position = countRecord + 1;
    }

    if (req.file)
      req.body.thumbnail = `/uploads/${req.file.filename}`;

    const deleted = {
      type: Boolean,
      default: false
    };

    req.body.deleted = deleted.default;    
    const record = new Product(req.body);
    record.save();  
    req.flash('info', "Thêm sản phẩm mới thành công!");
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
}

module.exports.editPage = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOne({
    _id: id,
    deleted: false
  });

  res.render(`${systemConfig.prefixAdmin}/pages/products/edit.pug`, {
    pageTitle: "Chỉnh sửa sản phẩm",
    product: product
  });
}

module.exports.editProduct = async (req, res) => {
  try {
    const id = req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);

    if(req.body.position) 
      req.body.position = parseInt(req.body.position);
    else
      delete req.body.position;

    if (req.file) 
      req.body.thumbnail = `/uploads/${req.file.filename}`;
  
    const response = await Product.updateOne({
      _id: id,
      deleted: false
    }, req.body);
    
    req.flash("info", "Cập nhật thành công!");
  } catch (error) {
    req.flash("info", "Cập nhật thất bại!");
  } finally {
    res.redirect("back");
  }
}

module.exports.detail = async (req, res) => {
  const id = req.params.id;
  const response = await Product.findOne({
    _id: id,
    deleted: false
  });
  res.render("./admin/pages/products/detail.pug", {
    pageTitle: "Trang chi tiết sản phẩm",
    product: response
  });
}