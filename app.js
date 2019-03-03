const express = require('express');
const bodyParser = require('body-parser');

// creates express app object;
const app = express();

// parse JSON information through middleware
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.send('Hello World!')
})
//listens on port 3000
app.listen(3000);