var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var request = require("request");
var cheerio = require("cheerio");

var Comment = require("./models/Comment.js");
var Article = require("./models/Article.js");

var htmlRouter = require("./controllers/html-routes.js");
var articleRouter = require("./controllers/article-routes.js");

mongoose.Promise = Promise;

var port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use("/", htmlRouter);
app.use("/", articleRouter);

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"; 
mongoose.connect(MONGODB_URI);
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

app.listen(port, function() {
  console.log("App running on port 3000!");
});