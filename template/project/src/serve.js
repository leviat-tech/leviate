/* eslint-disable*/

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = '8888';
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('dist'));
app.listen(port, () => console.log(`Files being served on port ${port}`));
