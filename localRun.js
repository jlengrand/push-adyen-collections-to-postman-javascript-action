import * as dotenv from 'dotenv';
import * as utils from './utils.js';

import {runParameters} from "./index.js";

dotenv.config();

/**
 * This function runs the same logic as the action, but locally. The inputs have to be provided manually
 *
 * warning : This function will use the POSTMAN API and run against your monthly quota.
 *
 * @param {string} path the path to the folder containing the API files to process
 * @returns {Promise<void>} a promise that resolves when the function is done
 */
async function localRun(path) {
    const apiFiles = await utils.getFilesInFolder(path, ".json");
    const apiFilesWithPath = apiFiles.map((file) => {  return `${path}/${file}`; });
    const apiFilesWithPathAsString = apiFilesWithPath.join(" ");

    const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY;
    const POSTMAN_WORKSPACE_ID = process.env.POSTMAN_WORKSPACE_ID;

    runParameters(POSTMAN_API_KEY, POSTMAN_WORKSPACE_ID, apiFilesWithPathAsString);
}

localRun("../adyen-postman/postman/")
    .then( _ => {
        console.log("Finished processing!");
    })
    .catch(err => {
        console.log(err);
    });
