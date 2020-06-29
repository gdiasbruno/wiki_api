//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

// ALL ARTICLES

app.route("/articles")

.get(function(req,res){
  Article.find({}, function (err, articles){
    if (err){
      res.send(err);
    } else {
      res.send(articles);
    }
  });
})

.post(function(req, res){

  const article = new Article(
      {
        title: req.body.title,
        content: req.body.content
       }
    );
  article.save(function(err) {
    if (!err) {
      res.send("Success!")
    } else {
      res.send(err)
    }
  });
})

.delete(function(req,res){
  Article.deleteMany({}, function(err){
    if (!err) {
      res.send("Successfully deleted!");
    } else {
      res.send(err);
    }
  });
});


// SPECIFIC ARTICLES

app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title:req.params.articleTitle}, function(err, result){
    if (!err) {
      res.send(result);
    } else {
      res.send(err);
    }
  });
})

.put(function(req, res){
  Article.update({title:req.params.articleTitle}, {title:req.body.title, content:req.body.content}, {overwrite:true}, function(err){
    if (!err) {
      res.send("Successfully updated")
    } else {
      res.send(err)
    }
  })
})

.patch(function(req,res){
  Article.update({title:req.params.articleTitle}, {$set: req.body}, function(err){
    if (!err) {
      res.send("Successfully updated")
    } else {
      res.send(err)
    }
  })
})

.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle}, function(err){
    if (!err){
      res.send("Sucessfully deleted specific article!")
    } else {
      res.send(err)
    }
  })
})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
