var app                  = require("express")();
var mysql                = require('mysql');
var bodyParser           = require('body-parser')

var Connection = mysql.createConnection({
    host: 'localhost',                              // For local testing use 'localhost'
    user: 'root',                                   // For local testing use 'root'
    password: '',
    database: 'webchatdb'
});

function handleDisconnect() {
    Connection = mysql.createConnection(Connection.config);  // Recreate the connection, since the old one cannot be reused.
    Connection.connect( function onConnect(err) {   // The server is either down
        if (err) {                                  // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 10000);    // We introduce a delay before attempting to reconnect,
        }                                           // to avoid a hot loop, and to allow our node script to
    });                                             // process asynchronous requests in the meantime.
                                                    // If you're also serving http, display a 503 error.
    Connection.on('error', function onError(err) {
        console.log('db error', err);
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.post('/login', (req, res) => {
    let retSuccess = false;
    handleDisconnect();
    Connection = mysql.createConnection(Connection.config);
    Connection.connect(function(err) {
        if (err) {
            console.error('error: ' + err.message + '\n Closing Database connection...');
            retSuccess = false;
            handleDisconnect();
            res.json({success: retSuccess ? "true" : "false"});
        }
        console.log('Connected to the MySQL server.');
    
        Connection.query("SELECT * FROM user", function (err, users, fields) {
            if (err) {
                console.error('error: ' + err.message + '\n Closing Database connection...');
                retSuccess = false;
                handleDisconnect();
                res.json({success: retSuccess ? "true" : "false"});
            }

            retSuccess = true;
          });
          
          res.json({success: retSuccess ? "false" : "true"});
    });
});

module.exports=app;