const app = require("express")();
const cryptoJS = require('crypto-js');
const bodyParser = require('body-parser');
const { enc } = require("crypto-js");
const sqlite3 = require('sqlite3').verbose();

let dateObj = new Date();
let currentDate = String(dateObj.getDate()).padStart(2, '0') + '-' + String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + dateObj.getFullYear();

let db = new sqlite3.Database('../database/WebChat.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.log("SQLite3 has encountered a connection error: " + err.message);
    }
    console.log('Successfully connected to SQLite3 database.');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/login', (req, res) => {

    db.serialize(() => {
        db.all(`SELECT ID as _ID, username as _username, password as _password FROM user`, [], (err, rows) => {
            returnValue = false;
            if (err) {
                console.log(err.message);
                returnValue = false;
            }
            else {
                let curDate = new Date();
                var reqHash = req.body.username + '/' + curDate.getUTCMonth() + '/' + curDate.getUTCDate() + '/' + curDate.getUTCFullYear() + '/' + curDate.getUTCMinutes() + '/' + curDate.getUTCSeconds();
                let reqDecrypted = cryptoJS.AES.decrypt(req.body.password, cryptoJS.SHA256(reqHash).toString()).toString(cryptoJS.enc.Utf8);
                let dbHash = cryptoJS.SHA256(req.body.username);
                rows.forEach((row) => {
                    let dbDecrypted = cryptoJS.AES.decrypt(row._password, dbHash.toString()).toString(enc.Utf8);
                    dbDecrypted = dbDecrypted.substring(0, dbDecrypted.length - 10);
                    if (row._username == req.body.username && dbDecrypted === reqDecrypted) {
                        if (req.body.username.match(/^[0-9a-zA-Z]+$/) && reqDecrypted.match(/^[0-9a-zA-Z]+$/))
                            returnValue = true;
                        else
                            returnValue = false;
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
                    let curDate = new Date();
                    var reqHash = req.body.username + '/' + curDate.getUTCMonth() + '/' + curDate.getUTCDate() + '/' + curDate.getUTCFullYear() + '/' + curDate.getUTCMinutes() + '/' + curDate.getUTCSeconds();
                    let passwordDecrypted = cryptoJS.AES.decrypt(req.body.password, cryptoJS.SHA256(reqHash).toString()).toString(cryptoJS.enc.Utf8);
                    let dbHash = cryptoJS.SHA256(req.body.username);
                    var dbToEncrypt = passwordDecrypted + currentDate;
                    let dbEncryptedPassword = cryptoJS.AES.encrypt(dbToEncrypt, dbHash.toString());

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

module.exports = app;