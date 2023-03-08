import * as postman from './postmanLibrary.js';
import * as dotenv from 'dotenv';
import * as util from 'util';

dotenv.config();

const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY;
const POSTMAN_WORKSPACE_ID = process.env.POSTMAN_WORKSPACE_ID;

async function localRun() {
    console.log(`Getting workspace ${POSTMAN_WORKSPACE_ID}!`);

    const workspace = await postman.getWorkspace(POSTMAN_WORKSPACE_ID, POSTMAN_API_KEY);
    console.log(`The workspace:`);
    console.log(util.inspect(workspace, {showHidden: false, depth: null, colors: true}));
    console.log("------");
    console.log(JSON.stringify(workspace, null, 4));

}

localRun()
    .then( _ => {
        console.log("Finished processing!");
    })
    .catch(err => {
        console.log(err);
    });