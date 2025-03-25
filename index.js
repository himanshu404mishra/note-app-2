const express = require("express");
const app = express()
const path = require("path")
const fs = require("fs")


app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname, "public")))

app.get("/", function(req,res){
    fs.readdir("./files", function (err, files) {
        res.render("index", {files: files})
    })
})

app.post("/create", function(req,res){
    const {title, task} = req.body
    let fileName = ""
   
    // logic for camel case
    title.trim().split(" ").forEach((val,i)=>{
        fileName += i === 0 ? val.toLowerCase() : val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    })

    // writing the file

    fs.writeFile(`./files/${fileName}.txt`,task, function (err) {
        if(err) console.log(err);
        else console.log("Task added!")
        res.redirect("/")
    })
   
})

app.get("/file/:filename", function (req,res) {
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function (err, fileData) {  
        if(err) console.log(err);
        else {
            // console.log(fileData) // !without flag of UTF-8 it will give buffer data
            res.render("show", {fileName:req.params.filename, fileData:fileData})
        }
    })    
})


app.get("/edit/:filename", function (req,res) {
    res.render("edit", {previousName: req.params.filename})
})
app.post("/edit", function (req,res) {
    const {previousName,newName} = req.body;
    fs.rename(`./files/${previousName}`, `./files/${newName}.txt`, function (err) {
        if(err) console.log(err);
        else res.redirect("/");
    })
})

app.get("/delete/:filename", function (req,res) {
    fs.unlink(`./files/${req.params.filename}`, function (err) {
        if(err) console.log(err);
        else res.redirect("/");
    })
})
app.listen(3000)