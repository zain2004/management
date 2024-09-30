module.exports.validateTitleOfProduct = (req, res, next) => {
    if (!req.body.title) {
        req.flash("info", "Tiêu đề không được để trống!");
        res.redirect("back");
        return;
    }

    if (req.body.title.length < 5) {
        req.flash("info", "Tiêu đề ít nhất là 5 ký tự!");
        res.redirect("back");
        return;
    }

    next();
}