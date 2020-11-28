const express = require('express'); // import express module (simplifies routing/requests, among other things)
const app = express(); // create an instance of the express module (app is the conventional variable name used)
const PORT = process.env.PORT || 5000; // use either the host env var port (PORT) provided by Heroku or the local port (5000) on your machine

const { Pool } = require('pg'); // import node-postgres
const pool = new Pool({ // create connection to database
  connectionString: process.env.DATABASE_URL,	// use DATABASE_URL environment variable from Heroku app 
	ssl: {
		rejectUnauthorized: false // don't check for SSL cert
	}
});

app.use(express.static('public')) // serve static files (css & js) from the 'public' directory
app.set('view engine', 'ejs'); // set the view engine to ejs
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies

app.get('/', (req, res) => { // route root directory ('/' is this file (app.js))
  const getString = 'SELECT * FROM my_activities'; // select all rows from the 'my_activities' table
  const countString = 'SELECT count(*) FROM my_activities' // get total row count from the 'my_activities' table
  pool.query(getString) // send query to select all rows from the 'my_activities' table 
    .then(activityResults => {
      let activities = activityResults.rows;
      pool.query(countString) // send query to get total row count from the 'my_activities' table
        .then(countResult => {          
          let count = countResult.rows[0].count;
          console.log('Activities List:', activities);
          console.log(`Activities Count: ${count}`);
          res.render('index', { activities: activities, count: count}); // render index.ejs, and send activity and count results to index.ejs
        }) 
      })
    .catch(err => console.log(err));
});


app.post('/add', (req, res) => { // route to /add that will add an item to the 'my_activities' table
  const addString = 'INSERT INTO my_activities (activity) VALUES ($1) RETURNING *'; // insert value into my_activities' table
  const activityToAdd = [ req.body.activity ]; // store activity from the body to variable
  pool.query(addString, activityToAdd) // send query to insert activity into the 'my_activities' table 
    .then(
      result => {
      res.send(result); // send result to the browser
    })       
    .catch(err => console.log(err));
});


app.post('/delete', (req, res) => { // route to /delete that will delete all items in the 'my_activities' table
  const removeString = 'DELETE FROM my_activities'; // delete all items in the 'my_activities' table
  pool.query(removeString) // send query delete all items in the 'my_activities' table
    .then(res.send('All activities cleared!')) // send confirmation to the browser
    .catch(err => console.log(err));  
});

app.listen(PORT, () => { // start server and listen on specified port
  console.log(`App is running on ${PORT}`) // confirm server is running and log port to the console
}) 