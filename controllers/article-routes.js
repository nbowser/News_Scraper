var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");
var router = express.Router();


// Home page
router.get("/scrape", function(req, res) {
  request("http://www.npr.org/sections/news/archive", function(error, response, html) {
    var $ = cheerio.load(html);
    $("div.archivelist > article").each(function(i, element) {

      var result = {};

      result.title = $(element).children("div.item-info").children("h2.title").html();
 
			result.description = $(element).children("div.item-info").children("p.teaser").children("a").text();
      
      var entry = new Article(result);

      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });

    });

    res.redirect("/");
  });  
});



router.get("/articles", function(req, res) {

  Article.find({})
  .exec(function(err, doc) {
    if (err) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});


router.post("/save/:id", function(req, res) {
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
  .exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("doc: ", doc);
    }
  });
});


//save article routes
router.get("/articles/:id", function(req, res) {
  Article.findOne({ "_id": req.params.id })
  .populate("comments")
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

router.post("/comment/:id", function(req, res) {
  var newComment = new Comment(req.body);
  newComment.save(function(error, newComment) {
    if (error) {
      console.log(error);
    }
    else {
      Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "comments": newComment._id }}, { new: true })
      .exec(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("doc: ", doc);
          res.send(doc);
        }
      });
    }
  });
});

// Delete saved article
router.post("/unsave/:id", function(req, res) {
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
  .exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("Article Removed");
    }
  });
  res.redirect("/saved");
});


module.exports = router;
