require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const app = express()
const config = require('./config')
const routes = require("./routers/routes")

app.use(cors())
app.use(express.json())

mongoose.connect(config.dbConnectionString, console.log("Connected to db"));

mongoose.connection.on("error", function (e) {
  console.error(e);
});

//routes that will be used
app.use(routes)

//manage errors
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message })
});

app.listen(config.port, () => {
  console.log("Server started ...")
});