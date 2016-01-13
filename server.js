var mysql = require("mysql");

// First you need to create a connection to the db
var con = mysql.createConnection({
  host: "us-cdbr-azure-central-a.cloudapp.net",
  user: "b443fc80dd2566",
  password: "4d39195d",
  database: "coffeechat"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

var str='';
con.query('SELECT id, first, last, age FROM TESTTABLE',function(err,rows){
  if(err) throw err;

  console.log('Data received from Db:\n');
  console.log(rows);

  for (var i = 0; i < rows.length; i++) {
   str+=rows[i].id+','+rows[i].first+','+rows[i].last+','+rows[i].age+'\n';
  };
});

con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});

var http = require('http')
var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World, NUCoffeeChat 2\n'+str);
}).listen(port);

var mysql = require("mysql");