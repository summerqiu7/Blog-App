const express = require("express");
bodyParser = require("body-parser");
mongoose = require("mongoose");
app = express();

// app config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb+srv://devsummer:summermg@cluster0-oa1hv.mongodb.net/RestfulBlogApp?retryWrites=true&w=majority',{useNewUrlParser:true});

// mongoose/model config
const blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    content:String,
    created:{type:Date,default:Date.now}
});
const Blog = mongoose.model("Blog", blogSchema);


app.get("/",function(req,res){
    res.redirect("/blogs");
});

// index route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index",{blogs:blogs});
        }
    });
});

// new route
app.get("/blogs/new",function(req,res){
            res.render("new");
});

// create route
app.post("/blogs",function(req,res){
    const title = req.body.title;
    const image = req.body.image;
    const content = req.body.content;
    const newBlog = {title:title, image:image,content:content}
    Blog.create(newBlog,function(err,newBlogs){
        if(err){
            console.log(err);
        } else {
       res.redirect("/blogs");
        }
    });
});

// show page
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundBlog});
        }
    })
});

// edit route
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    });
});

// update route
app.post("/blogs/:id", function(req,res){
    Blog.findByIdAndUpdate(req.params.id,{
        ...req.body
    },function(err,updatedBlogs){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// destroy route
app.post("/blogs/:id/delete",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
});



app.listen(3000, function(){
    console.log("server is running!")
});



