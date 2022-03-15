let app                  = require("express")();
let bodyParser           = require('body-parser');
const sqlite3            = require('sqlite3').verbose();

let db                   = new sqlite3.Database('../database/webchat.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error("SQLite3 has encountered a connection error: " + err.message);
    }
    console.log('Successfully connected to SQLite3 database.');
  });

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.post('/login', (req, res) => {

db.serialize(() => {
    db.each(`SELECT ID as _ID, username as _username, password as _password FROM user`, (err, row) => {

            if (err) {
                console.error(err.message);
                res.json({success: 'false'});
            }

            console.log("| ID: " + row._ID + " | Username: " + row._username + " | Password: " + row._password);

            if(row._username == req.body.username && row._password == req.body.password)
                res.json({success: 'true'});
            else
                res.json({success: 'false'});
        });

    });
    
});

module.exports=app;