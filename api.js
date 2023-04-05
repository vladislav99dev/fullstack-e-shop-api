const express = require("express");
const dotenv = require('dotenv')
const router = require('./router')
const cors = require('cors')
const databaseConnect = require("./config/databaseConnect");

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(router);
dotenv.config();


databaseConnect(process.env.DB_CONNECTION_STRING)
  .then((response) => {
    app.listen(process.env.PORT, () => {
      console.log(`App is connected to the cloud Database.`);
      console.log(`App is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
