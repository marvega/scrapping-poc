require('dotenv').config()
const mongoose = require('mongoose');
const browserObject = require('./browser/browser');
const scraperController = require('./controller/pageController');

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();

// Pass the browser instance to the scraper controller
scraperController(browserInstance)