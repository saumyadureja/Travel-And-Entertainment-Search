
'use strict';

const yelp = require('yelp-fusion');

const client = yelp.client('uNepJNRTN56uUcY5_kLEkVgoFT81hcjzNUAK-PTbpgHTip4kCTezTa2rJIa9HMsOhIwlzipO6NCeDPA_Jr7BTJ-QqcbHqqXEoSkLNuz5JA9a1p1g0z0D-8YmLcDLWnYx');
var express=require("express");
var myparser=require("body-parser");
const https = require("https");
var app=express();
app.use(myparser.urlencoded({extended:true}));
var sloc;
app.get("/current",function(req,res){
//  res.writeHead(statusCode);
res.setHeader('Access-Control-Allow-Origin','*');

    sloc=JSON.stringify(req.query.givenLocation);
    sloc=sloc.replace(/\s/g,"+");
    //console.log(sloc);
   //console.log (' https://maps.googleapis.com/maps/api/geocode/json?address=sloc&key=AIzaSyC7bWom77xCgyjEAJh0aM2QKWkCp5lgSBw');
    https.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${sloc}&key=AIzaSyC7bWom77xCgyjEAJh0aM2QKWkCp5lgSBw`, function (resApi) {



      res.writeHead(resApi.statusCode);
                 resApi.pipe(res);
             }
         ).end();

});

app.get("/search",function(req,res){
//  res.writeHead(statusCode);
res.setHeader('Access-Control-Allow-Origin','*');

    var keyw=req.query.field1;//keyword
    var category=req.query.field2;//type
    var distance=(req.query.field3)*1609.34;//distance in meters
    //console.log(radius);
    var lat=req.query.field4;
  //  console.log(lat);
    var long=req.query.field5;
  //  console.log(long);
  https.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${distance}&type=${category}&keyword=${keyw}&key=AIzaSyC7bWom77xCgyjEAJh0aM2QKWkCp5lgSBw`,function (resp){
    //  console.log(res.next_page_token);
     res.writeHead(resp.statusCode);
      resp.pipe(res);
   }

  ).end();
});

app.get("/next", function(req,res){

  res.setHeader('Access-Control-Allow-Origin','*');
  var nextToken=req.query.nextPageToken;
  https.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${nextToken}&key=AIzaSyC7bWom77xCgyjEAJh0aM2QKWkCp5lgSBw`,function (respon){

         res.writeHead(respon.statusCode);
         respon.pipe(res);
  }

).end();
//  console.log(nextToken);
    //console.log(la);


});


// matchType can be 'lookup' or 'best'
app.get("/yelp", function(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
client.businessMatch('best', {
  name: req.query.place_name,
  address1: req.query.add1,
  address2: req.query.add2,
  city: req.query.placeCity,
  state: req.query.placeState,
  country: req.query.placeCountry
}).then(response => {
   if(response&&response.jsonBody.businesses&&response.jsonBody.businesses.length)
  {
    client.reviews(response.jsonBody.businesses[0].id).then(response => {
  //  console.log(response.jsonBody);
     res.send(response.jsonBody);
  })

}
else
  {
    res.send(false);
  }
  //res.send);
}).catch(e => {
  console.log(e);
});


});
//app.listen(3000);
var port=process.env.PORT||8081;
app.listen(port,function(){
  console.log("server started on port 8081");
});
