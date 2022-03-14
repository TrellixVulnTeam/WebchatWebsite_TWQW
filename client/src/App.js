import React from 'react';
import style from "./core/styles/login.css"

class App extends React.Component {
  constructor(props)  {                                                   // Init our constructor and variables.
    super(props);
    this.state = {
      APIResponce: '',
      alias: '',
      password: ''
    };
    this.Authenticate = this.Authenticate.bind(this);                     // So we are able to call this from render()'s html.
    }

  Authenticate(event)  {
    event.preventDefault();                                               // So we don't refresh page on function call.
    let dataPOST =  {
      username: this.state.alias,
      password: this.state.password
    };
    if(this.state.alias != '' && this.state.password != 0)  {
      fetch('http://localhost:3000/api/v1/login', {
        method: 'POST',
        body: JSON.stringify(dataPOST),
        headers: { 'Content-Type': 'application/json' }
      })
      .then((res) => res.json())                                           // Parse responce as HTML.
      .then((data) => this.handleChange({APIResponce: data.success}))      // Set APIResponce to data.TYPE <-- responce of the testAPI function.
      .catch(this.handleChange({APIResponce: 'Failed to recive responce.'})); // If failed return an error.
    }
    else
      this.handleChange({APIResponce: 'Please enter a username/password'}); // If failed return an error.
  }

  componentWillMount()  {                                                // This is periodicly run.
  }

  handleChange(changeObject) {                                           // Sets the data values of variables.
    this.setState(changeObject)
  }
  
  render() {
    
    return (
      <>
      <div className="login-box">
      <br/> <h1 type="title">Login</h1> <br/>
      <form acceptCharset="UTF-8" onSubmit={this.Authenticate}>
        <img src="images/user.png" width={100} height={100} />
        <input
          type="username"
          placeholder="Username"
          maxLength="24"
          name ="alias"
          value={this.state.alias}
          onChange={(e) => this.handleChange({ alias: e.target.value })}
          
          />
        <input
          type="password"
          placeholder="Password"
          maxLength="24"
          name ="password"
          value={this.state.password}
          onChange={(e) => this.handleChange({ password: e.target.value })}
          
        />
        <div>
          <button type="submit">Login</button>
          <button type="submit">Register</button>
        </div>
        <p>{this.state.APIResponce}</p>
        </form>
      </div>
      </>
    );
  }
}
export default App;
/*

var mysql      = require('mysql');

var DataBaseConnection = mysql.createConnection({
    host: 'localhost',                              // For local testing use 'localhost'
    user: 'root',                                   // For local testing use 'root'
    password: '',
    database: 'webchatdb'
});

DataBaseConnection.connect(function(exeption) {
    if (exeption) 
        return console.error('error: ' + exeption.message);
    
    console.log('Connected to the MySQL server.');


    DataBaseConnection.query("SELECT * FROM user", function (err, users, fields) {
        if (err) {
            console.error('error: ' + exeption.message + '\n Closing Database connection...');
            DataBaseConnection.end();
            return null;
        }  //Report the error and close the connection

        //Setup values to insert into dbTable
        //let query = 'ALTER TABLE user AUTO_INCREMENT = 0;'
        let query = `INSERT INTO user (alias, password, userGroup) VALUES ?;`;
        let values = [
            ['notSam25', 'pass', 'user']
        ];

        DataBaseConnection.query(query, [values], (err) => {  // Insert the array into the dbTable
            if (err) 
                throw err;
            
            console.log("All values inserted into database 'user'");
        });

        console.log(users);
      });
});

*/