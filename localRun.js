const postman = require('./postmanLibrary');
require('dotenv').config()

const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY;
const POSTMAN_WORKSPACE_ID = process.env.POSTMAN_WORKSPACE_ID;

function localRun(){
    console.log(`Hello ${POSTMAN_API_KEY}!`);
    console.log(`Hello ${POSTMAN_WORKSPACE_ID}!`);
}

localRun()