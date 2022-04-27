require('dotenv').config();

const Carbon = require('./src');

const app = Carbon();

app.listen(3000);