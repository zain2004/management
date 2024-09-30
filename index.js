const express = require('express');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
require('dotenv').config();
const systemConfig = require("./config/system.js");

const app = express();
const port = process.env.PORT;

const database = require("./config/database.js");
database.connect();

const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route.js");
const { default: mongoose } = require('mongoose');

app.set('views', './views'); //Tìm đến thư mục tên là views
app.set('view engine', 'pug'); // template engine sử dụng: pug

app.use(express.static('public')); //Thiết lập thư mục chứa file tĩnh

// Khai báo biến toàn cục cho file pug
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//add flash to announce
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('_method'));

//Khai báo đường dẫn
routeAdmin.routeAdmin(app);
routeClient.routeClient(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});