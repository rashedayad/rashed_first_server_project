// jsut the begging
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");



const app = express() ;
const port = 3000 ;

//for the input in the html
app.use(bodyParser.urlencoded({extended:true}));
// for css files and any thing that html code use staticly
app.use(express.static("public"));




//to send the html code when log in to the server
app.get("/" , function (req ,res){
  res.sendFile(__dirname +"/singup.html");
});


// when i send data back to the server
app.post("/" , function(req , res){
  console.log(req.body);
  //data to var
  var fName = req.body.nameF ;
  var sName = req.body.nameS ;
  var email = req.body.email ;
  console.log(fName + ' ' +  sName + ' '+  email);


  // data that we going to send to mailchimp to javascript form
  var data = {
    members : [{
      email_address : email ,
      status : "subscribed" ,
      merge_fields : {
        FNAME : fName ,
        LNAME : sName ,


      }
    }]
  };
// to JSON FORM
  var turnDataJson = JSON.stringify(data);



  //mailchimp
  const url = "https://us12.api.mailchimp.com/3.0/lists/00fa65ce41";

  const optional = {
    method:"post",
    auth:"rahed:e5b4cb616f4866a871d90a25f18c096e-us12"
  };

/// I HAVE UNDER STAND IT just loging to the server
  const request = https.request(url , optional , function(response) {
    var check = response.statusCode ;
    if(check === 200){
      res.sendFile(__dirname + "/success.html")
    }else{
      res.sendFile(__dirname + "/failure.html")
    }


    response.on("data" , function(data){
      console.log(JSON.parse(data));
    });
  });

//send data to mailchimp
  request.write(turnDataJson);
  request.end();


});

app.post("/failure" , function(req , res){
  res.redirect("/");
});



app.listen(process.env.PORT || port , function(){
  console.log("server on port" + port);
});


// api key
// e5b4cb616f4866a871d90a25f18c096e-us12

// id
// 00fa65ce41
