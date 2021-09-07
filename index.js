const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();

const config = require('./config');
const api = require('./api');

app.use(cors());
app.use(express.json());

mongoose.connect(config.dbConnectionString);

app.listen(config.port, () => {
  console.log('Servidor iniciado ...');
});
