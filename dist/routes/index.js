const express = require('express');
const config = require('../config');
const middleware = require('../middleware');
const initializeDb = require('../db');
const book = require('../controller/book');

let router = express();

initializeDb(db => {
    router.use(middleware({config, db}));

    router.use('/books', book ({config, db}));
});

module.exports = router; 

