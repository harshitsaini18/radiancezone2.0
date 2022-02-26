//const dotenv = require('dotenv')
// const generator = require("pdf-excel-generator");
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const router = new express.Router();
const bcrypt = require("bcrypt")
const auth = require("./middleware/auth")
var cookieParser = require('cookie-parser')
const exceljs = require("exceljs")
// var msopdf = require('node-msoffice-pdf');

const d = new Date();

let mymonth = (d.getMonth() + 1).toString()
let month;
if (mymonth.length == 1) {
    month = '0' + (d.getMonth() + 1).toString()
} else { month = mymonth; }
const app = express();
//app.use(require('./router/auth'))
require('./db/conn');
const dpp = require('./models/dpp');
const test = require('./models/test');
const user = require('./models/signup');
const { json } = require('express');
const { log } = require('console');
const port = process.env.PORT || 5000;

app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(cookieParser());
   
///////////////////////////////////
///////   Signup API    ///////////
///////////////////////////////////

app.post("/signup",async (req,res)=>{
    console.log(req.body);
    try {
        let email = await user.findOne({email:req.body.email});
        // console.log(email);
        if (email) {
            res.send(JSON.stringify({isUser:true}));
        } else {
            let name = req.body.name;
            let email = req.body.email;
            let password = req.body.password;
            console.log(name);
            let userData = new user({name,email,password});
            let newUser = await userData.save();
            res.send(JSON.stringify({isUser:false}));
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})

app.post("/login", async (req,res)=>{
    console.log("trying")
    try {
        let currentUser = await user.findOne({email:req.body.email});
        let {email,password} = req.body;
        let isMatch = await bcrypt.compare(password,currentUser.password)
        
        if (isMatch) {
            let token = await currentUser.generateAuthToken();
            console.log(token);
            res.cookie("jwt",token,{expires:new Date(Date.now()+2629800000),httpOnly:true});
            res.send(JSON.stringify({login:true}));

        } else {
            res.send(JSON.stringify({login:false}));
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})

router.get("/submit", auth, async (req,res)=>{
    console.log("submitttttt");
    res.send(req.rootUser);
})

router.get("/logout", async (req,res)=>{
    console.log("logout");
    res.clearCookie("jwt");
    res.clearCookie("gtoken");
    res.status(200).send(req.rootUser);
})

router.post("/google",async (req,res)=>{
    token = req.body.token;
    res.cookie("gtoken",token,{expires:new Date(Date.now()+2629800000),httpOnly:true});
    res.send("login successfully");
})

router.post('/submit',auth, async (req, res) => {
    try {
        if (req.body.typer == 'dpp'){
            console.log("dpppppppp");
            
        const dppData = new dpp({
            subject: req.body.subject,
            score: req.body.marks,
            complete: req.body.complete,
            date: d.getDate().toString() + month,
            user:req.body.user
        })
        const dppit = await dppData.save(); 
        // console.log(dppit);
        } else if(req.body.typer=="test") {
            let nDate = new Date();
            let newDate = nDate.toLocaleDateString();
            const testData = new test({
                physics: {
                    score: req.body.pmarks,
                    complete: req.body.pcomplete
                },
                chemistry: {
                    score: req.body.cmarks,
                    complete: req.body.ccomplete
                },
                maths: {
                    score: req.body.mmarks,
                    complete: req.body.mcomplete
                },
                user:req.body.user,
                date: d.getDate().toString() + month,
                mydate: newDate
            })
            // console.log("rrgregr");
            const testit = await testData.save();
            // } else {
            //     let myTestData = await test.find();
            //     oldTestData[0].physics.score.push(req.body.pmarks);
            //     oldTestData[0].physics.complete.push(req.body.pcomplete);
            //     oldTestData[0].chemistry.score.push( req.body.cmarks);
            //     oldTestData[0].chemistry.complete.push( req.body.ccomplete);
            //     oldTestData[0].maths.score.push( req.body.mmarks);
            //     oldTestData[0].maths.complete.push( req.body.mcomplete);
            //     oldTestData[0].date.push(d.getDate().toString() + month);
            //     oldTestData[0].mydate.push(newDate);
            //    console.log(oldTestData[0]);
            //    let result = await test.findOneAndUpdate({id:myTestData[0]._id}, oldTestData[0]);
            //     console.log(result)// test.update(oldTestData);
            // }
            
            
        }else{
            res.status(400).send(error);
        }   
        res.redirect("/");
    } catch (error) {
        res.status(400).send(error);
    }
});

// app.post('/submittest', async(req, res) => {
//     try {
//         const testData = new test({
//             physics: {
//                 score: req.body.pmarks,
//                 complete: req.body.pcomplete
//             },
//             chemistry: {
//                 score: req.body.cmarks,
//                 complete: req.body.ccomplete
//             },
//             maths: {
//                 score: req.body.mmarks,
//                 complete: req.body.mcomplete
//             },
//             date: d.getDate().toString() + month
//         })
//         const testit = await testData.save();
//         res.redirect("/");
//     } catch (error) {
//         res.status(400).send(error);
//     }
// }); 

app.use(router)


 //const hbs = require('hbs');
// var exceljs = require('exceljs');


// app.use(express.json());


// const static_path = path.join(__dirname, '../public');
// const template_path = path.join(__dirname, '../templates/views');
// const partials_path = path.join(__dirname, '../templates/partials');
// //using script 

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.static(static_path));
// //app.set('view engine', 'hbs');
// //app.set('views', template_path);
// //hbs.registerPartials(partials_path);
// //hbs.registerPartial('nav', '{{nav}}');


// // sendFile will go here
// app.get('/', function(req, res) {
//     res.render('index')
// });

// app.get('/submitResult', function(req, res) {
//     res.render('submit')
// });


// let mymonth = (d.getMonth() + 1).toString()
// let month;
// if (mymonth.length == 1) {
//     month = '0' + (d.getMonth() + 1).toString()
// } else { month = mymonth; }
// //post data




app.get('/analysis',auth, async(req, res) => {
    try {
        var subjectArr = [];
        var scoreArr = [];
        var completeArr = [];
        var dateArr = [];
        // var getTestData = [];
        let cursor = await dpp.find({user:req.rootUser.email}).select('-_id -__v');
        let TestData = await test.find({user:req.rootUser.email}).select('-_id -__v');
        cursor.forEach((doc, err) => {
            var StartDateServer = doc.mydate;
            var parsedDate = new Date(StartDateServer);
            var finalDate = parsedDate.toLocaleDateString();
            subjectArr.push(doc.subject);
            scoreArr.push(doc.score);
            completeArr.push(doc.complete);
            dateArr.push(finalDate);
        })
        // console.log(cursor2)
        // cursor2.forEach((doc, err) => {
        //     console.log(doc,"hhhhh");
        //     let kk = doc;
        //     getTestData.push(kk);
            
        // })
        let tata = { subjectArr, scoreArr, completeArr, dateArr, TestData };
        // console.log(tata)
        res.send( JSON.stringify({data:tata,user:req.rootUser}));
    } catch (error) {
        res.status(400).send(error);
    }
});


app.get('/data',auth, async function(req, res) {
    try {
        const xddata = await dpp.find({user:req.rootUser.email});
        const xtdata = await test.find({user:req.rootUser.email});
        const workbook = new exceljs.Workbook();
        const dworksheet = workbook.addWorksheet("DPP DATA");
        const tworksheet = workbook.addWorksheet("Test DATA");
        workbook.creator = 'Priyanshu Saini';
        workbook.lastModifiedBy = 'Bot';

        dworksheet.columns = [
            { header: "S.no", key: "_id", width: 10 },
            { header: "Date", key: "mydate", width: 10 },
            { header: "Subject", key: "subject", width: 10 },
            { header: "Score", key: "score", width: 10 },
            { header: "Completed", key: "complete", width: 10 }
        ];
        
        tworksheet.columns = [
            { header: "Date", key: "mydate", width: 10 },
            { header: "Physics", key: "physics.score", width: 10 },
            { header: "Physics", key: "physics.complete", width: 10 },
            { header: "Chemistry", key: "chemistry.score", width: 10 },
            { header: "Chemistry", key: "chemistry.complete", width: 10 },
            { header: "Maths", key: "maths.score", width: 10 },
            { header: "Maths", key: "maths.complete", width: 10 }
        ];
        let trow = ['',"Score","Complete","Score","Complete","Score","Complete"]
        tworksheet.addRow(trow);
        tworksheet.mergeCells("A1:A2")
        tworksheet.mergeCells("B1:C1")
        tworksheet.mergeCells("D1:E1")
        tworksheet.mergeCells("F1:G1")

        xddata.forEach(dtata => {
            dworksheet.addRow(dtata);
        });
        xtdata.forEach(dtata => {
            tworksheet.addRow([dtata.mydate,dtata.physics.score,dtata.physics.complete,dtata.chemistry.score,dtata.chemistry.complete,dtata.maths.score,dtata.maths.complete]);
        });
        dworksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });
        tworksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });
        tworksheet.eachRow(function (Row, rowNum) {
            /** Row.alignment not work */
            // Row.alignment = { horizontal: 'left' }
    
            Row.eachCell(function (Cell, cellNum) {
                /** cell.alignment not work */
                if (rowNum <= 2) {
                    Cell.alignment = {
                        vertical: 'middle',
                        horizontal: 'center'
                    }
                }else{
                    Cell.alignment = {
                        vertical: 'middle',
                        horizontal: 'left'
                    }
                }
            })
        })
        dworksheet.eachRow(function (Row, rowNum) {
            /** Row.alignment not work */
            // Row.alignment = { horizontal: 'left' }
    
            Row.eachCell(function (Cell, cellNum) {
                /** cell.alignment not work */
                if (rowNum == 1) {
                    Cell.alignment = {
                        vertical: 'middle',
                        horizontal: 'center'
                    }
                }else{
                    Cell.alignment = {
                        vertical: 'middle',
                        horizontal: 'left'
                    }
                }
            })
        })

        console.log("yesssssss");
        const nddata = await workbook.xlsx.writeFile("dpp_data.xlsx")

        const file = './dpp_data.xlsx';
        res.download(file);
        // res.send("yesssssssss");
    } catch (error) {
        res.status(500).send(error);
    }
});
 


 // ... other app.use middleware 
app.use(express.static(path.join(__dirname, "client", "build")))

// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});





// app.get('/', function(req, res) {
//     res.send('hello')
// })

app.listen(port);
console.log('Server started at http://localhost:' + port);