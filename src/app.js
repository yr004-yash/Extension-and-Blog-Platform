import express from "express";
import bodyParser from "body-parser";
import path from "path";
import hbs from "hbs";
import fetch from "node-fetch";
import { load } from "cheerio";


//import connection and collection
import "./db/conn.js";
import User from "./models/coll.js";
import {blg} from "./models/coll.js";
import { fileURLToPath } from 'url';
import { log } from "console";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

//setting the path
const staticpath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../templates/views");
const partialpath = path.join(__dirname, "../templates/partials");


//middleware
app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use('/jq', express.static(path.join(__dirname, "../node_modules/bootstrap/dist")));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticpath));
app.use(bodyParser.json());
app.set("view engine", "hbs");
app.set("views", templatepath);
hbs.registerPartials(partialpath);
//app.use(express.json());






//routing
var ii,nm,emaill, passwordd,usernamebb;

app.get("/", (req, res) => {
    res.render("index");
})
app.get("/loginindex", (req, res) => {
   res.render("loginindex");
})
app.get("/register", (req, res) => {
    res.render("register");
})
app.post("/register", async (req, res) => {
    try {
        const userData = new User({
            username: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
        });
        await userData.save();
        const newDocument = new blg({
            usernameb: req.body.name,
            email:req.body.email,
        });
        await newDocument.save();
        res.redirect("/login");
    }
    catch (err) {
        res.status(500).send(err);
    }
})
app.get("/login", (req, res) => {
    res.render("login");
})
app.post("/login", async (req, res) => {
    try {
        emaill = req.body.emaill;
        passwordd = req.body.passwordd;
        const gett = await User.find({ email: emaill, password: passwordd });
        //console.log(gett[0]?.name);
        if (gett[0]?.email == undefined) {
            res.send("User not Found");
        }
        else {
            res.redirect("/extension");
        }
    }
    catch (err) {
        console.log(err);
    }
})
app.get("/delete", async (req, res) => {
    try {
        const dlt = await User.findOneAndDelete({ email: emaill, password: passwordd });
        res.redirect("/");
    }
    catch (err) {
        console.log(err);
    }
})
app.get("/extension", (req, res) => {
    res.render("extension");
})
app.post("/cfextension1/:id", async (req, res) => {
    try {
        var url = `https://codeforces.com/ratings/organization/${req.params.id}`;
        const original = await fetch(url);
        const html = await original.text();
        const $ = load(html);
        //4520i1
        var list = [], cnt = 0;
        const z = $("#pageContent").find('div:eq(2)').find('div:eq(6)').find('table:eq(0)').find('tbody:eq(0)');
        $(z).children().each((i) => {

            const res = z.find(`tr:eq(${i})`).find('a:eq(0)').text();
            const clss= z.find(`tr:eq(${i})`).find('td:eq(1)').find('a:eq(0)').attr('class');
                if(clss!=undefined){
                    var cssl=clss.split(" ");
                    list.push([res,cssl[1]]);
            }
        });
        res.json({list});
    }
    catch (err) { console.log(err); }
})
app.get("/cfextension", (req, res) => {
    res.render("cfextension");
})
app.get("/cfextension1", (req, res) => {
    res.render("cfextension1");
})
app.get("/blog", (req, res) => {
    res.render("blog");
})

app.get("/usr", async(req, res) => {
    //to send all the user's name to front end
    try {
        const usrdata = await blg.find({});
        res.json(usrdata);
      } catch (error) {
        console.error('Error:', error);
      }
})

app.get("/blog/createblog",(req, res) => {
    //to create a new blog
    res.render("createb");
})
app.get("/blog/viewblog",(req, res) => {
    //to see all blogs 
    res.render("viewb");
})
app.post("/blog/createblog",async(req, res) => {
    //to add a new blog in user's database
    //console.log(req.body.newb);=>new blog created by user
    //try{
        //Update here
        // const dataa=await User.updateOne({email:emaill});
          const newBlgData = {
            b: req.body.newb
          };
          console.log(req.body.newb);
          console.log(emaill);
          try{
            const finalres=await blg.updateOne({email:emaill},{
                $push:
                    {blgs:newBlgData}
            },{
                new:true,
                useFindAndModify:false
            });
            console.log(finalres); 
            res.redirect("/blog");
        }catch(err){console.log(err);}

        // blg.updateOne(
        //     {email:emaill},
        //     { $set: { blgs: newBlgData } },
        //     { new: true },
        //     (err, updatedDocument) => {
        //       if (err) {
        //         console.error('Error updating document:', err);
        //       } else {
        //         console.log('Document updated successfully:', updatedDocument);
        //         res.redirect("/blog");
        //       }
        //     }
        //   );
        
    //}
    //catch(err){console.log(err);}
})
app.get("/addcmnt",(req, res) => {
    //to see all blogs 
    res.render("addcmnt");
})
app.post("/addcmnt",async(req, res) => {
    //to see all blogs 
    try{
        // console.log(nm);
        const gett = await User.find({ email: emaill, password: passwordd });
        //console.log(gett[0].username);
        const newBlgData = {
            usernamec:gett[0].username,
            c:req.body.cmnt
        };
        const up = {};
        up[`blgs.${ii}.cmnts`] = newBlgData;
        const finalres=await blg.updateOne({usernameb:nm},{
            $push:up
        },{
            new:true,
            useFindAndModify:false
        });
          console.log(finalres);
        res.redirect("/blog/viewblog"); 
    }
    catch(err){console.log(err);}
})
app.post("/api/addcmnt", async (req, res) => {
    try {
        ii = req.body.inputData;
        nm = req.body.extraData;
    }
    catch (err) {
        console.log(err);
    }
})








//server
app.listen(port, () => {
    console.log(`server is running at port number ${port}`);
})