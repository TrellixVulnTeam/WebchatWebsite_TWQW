var app                  = require("express")();
var mysql                = require('mysql');
var bodyParser           = require('body-parser');



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.post('/login', (req, res) => {
    let retSuccess = false;

    res.json({success: retSuccess ? "false" : "true"});
});

module.exports=app;