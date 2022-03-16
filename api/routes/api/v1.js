let app = require("express")();
let bodyParser = require('body-parser');
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

app.post('/login', (req, res) => {

    db.serialize(() => {
        db.all(`SELECT ID as _ID, username as _username, password as _password FROM user`, [], (err, rows) => {
            returnValue = false;
            if (err) {
                console.log(err.message);
                returnValue = false;
            }
            else {
                rows.forEach((row) => {
                    if (row._username == req.body.username && row._password == req.body.password)
                        returnValue = true;
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
                    db.each('INSERT INTO user(username, password, regDate) VALUES (?, ?, ?);', [req.body.username, req.body.password, currentDate], (err, row) => {
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