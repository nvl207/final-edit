const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 300;
const morgan = require("morgan");
const db_connect = require("./config/db_connect");
const route = require("./routes");
const bodyParser = require("body-parser");

const cors = require("cors");


db_connect.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(cors());
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));
// app.use(cookieParser());

route(app);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log('asdd')
  
})
