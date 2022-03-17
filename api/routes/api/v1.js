let app = require("express")();
let cryptoJS = require('crypto-js');
let bodyParser = require('body-parser');
const { enc } = require("crypto-js");
const { json } = require("express");
const sqlite3 = require('sqlite3').verbose();

let dateObj = new Date();
let month = String(dateObj.getMonth() + 1).padStart(2, '0');
let day = String(dateObj.getDate()).padStart(2, '0');
let year = dateObj.getFullYear();
let currentDate = day + '-' + month + '-' + year;


let db = new sqlite3.Database('../database/webchat.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.log("SQLite3 has encountered a connection error: " + err.message);
    }
    console.log('Successfully connected to SQLite3 database.');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// See TODO for more info on changes
app.post('/login', (req, res) => {

    db.serialize(() => {
        db.all(`SELECT ID as _ID, username as _username, password as _password FROM user`, [], (err, rows) => {
            returnValue = false;
            if (err) {
                console.log(err.message);
                returnValue = false;
            }
            else {
                var toHash = req.body.username + dateObj.getUTCMonth() + ' ' + dateObj.getUTCDate() + ' ' + dateObj.getUTCFullYear() + ' ' + dateObj.getUTCMinutes() + ' ' + dateObj.getUTCSeconds;
                let reqHash                     = cryptoJS.SHA256(toHash);
                var passwordBytes               = cryptoJS.AES.decrypt(req.body.password, reqHash.toString());
                var passwordDecrypted           = passwordBytes.toString(cryptoJS.enc.Utf8);
                let dbHash                      = cryptoJS.SHA256(req.body.username);
                rows.forEach((row) => {
                    let dbDecrypted = cryptoJS.AES.decrypt(row._password, dbHash.toString()).toString(enc.Utf8);

                    if (row._username == req.body.username)
                    {
                        console.log('dbDecrypted: ' + dbDecrypted);
                        console.log('reqDecrypted: ' + passwordDecrypted);
                        if(dbDecrypted.includes(passwordDecrypted))
                        returnValue = true;
                    }
                });
            }
            res.json({ success: returnValue ? 'true' : 'false' });
        });
    });
});

app.post('/register', (req, res) => {

    db.serialize(() => {
        db.all(`SELECT ID as _ID, username as _username, password as _password FROM user`, [], (err, rows) => {
            returnValue = true;
            if (err) {
                console.log(err.message);
                returnValue = false;
            }
            else {
                rows.forEach((row) => {
                    if (row._username == req.body.username)
                        returnValue = false;
                });
                if (returnValue) {
                    var toHash = req.body.username + dateObj.getUTCMonth() + ' ' + dateObj.getUTCDate() + ' ' + dateObj.getUTCFullYear() + ' ' + dateObj.getUTCMinutes() + ' ' + dateObj.getUTCSeconds;
                    let reqHash                 = cryptoJS.SHA256(toHash);
                    let passwordDecrypted       = cryptoJS.AES.decrypt(req.body.password, reqHash.toString()).toString(cryptoJS.enc.Utf8);
                    let dbHash                  = cryptoJS.SHA256(req.body.username);
                    var dbToEncrypt             = passwordDecrypted + currentDate;
                    console.log('dbToEncrypt: ' + dbToEncrypt);
                    let dbEncryptedPassword     = cryptoJS.AES.encrypt(dbToEncrypt, dbHash.toString());

                    db.each('INSERT INTO user(username, password, regDate) VALUES (?, ?, ?);', [req.body.username, dbEncryptedPassword, currentDate], (err, row) => {
                        if (err) {
                            console.log(err);
                            returnValue = false;
                        }
                        returnValue = true;
                    });
                }
            }
            res.json({ success: returnValue ? 'true' : 'false' });
        });
    });
});

app.post('/beta', (req, res) =>  {
    /*
    var regDate1 = "3-16-2022";
    var exampleText = "test123";
    var hash                    = cryptoJS.SHA256(req.body.username);
    var encrypted = cryptoJS.AES.encrypt((exampleText + regDate1), hash.toString());
    var unencrypted = cryptoJS.AES.decrypt(encrypted, hash.toString()).toString(enc.Utf8);
    res.json({enc: encrypted.toString(), dec: unencrypted.toString()});
    */
    res.json({message: 'return message'});
    
    /*
    var curTimestamp            = dateObj.getUTCMonth() + ' ' + dateObj.getUTCDate() + ' ' + dateObj.getUTCFullYear() + ' ' + dateObj.getUTCMinutes() + ' ' + dateObj.getUTCSeconds;
    var hash                    = cryptoJS.SHA256(req.body.username + curTimestamp);
    var passwordBytes           = cryptoJS.AES.decrypt(req.body.password, hash.toString());
    var passwordDecrypted       = passwordBytes.toString(cryptoJS.enc.Utf8);
    res.json({dcPassword: passwordDecrypted});*/
});

module.exports = app;