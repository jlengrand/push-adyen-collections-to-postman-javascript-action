import * as postman from './postmanLibrary.js';
import * as dotenv from 'dotenv';
import * as utils from './utils.js';

dotenv.config();

const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY;
const POSTMAN_WORKSPACE_ID = process.env.POSTMAN_WORKSPACE_ID;

/**
 * This function runs the same logic as the action, but locally. The inputs have to be provided manually
 *
 * warning : This function will use the POSTMAN API and run against your monthly quota.
 *
 * @param {string} filesToProcess space separated list of all files to process
 * @returns {Promise<void>} a promise that resolves when the function is done
 */
async function localRun(filesToProcess) {
    console.log(`Getting workspace ${POSTMAN_WORKSPACE_ID}!`);

    const workspace = await postman.getWorkspace(POSTMAN_WORKSPACE_ID, POSTMAN_API_KEY);
    const collections = workspace.workspace.collections;

    const filesToProcessAsList = filesToProcess.split(' ');
    const apisToProcess = utils.filenamesToSet(filesToProcessAsList);

    const apisToProcessStructures = apisToProcess.map((api) => {
        console.log(`Processing ${api}`);
        return {
            "filepath": api,
            "name" : utils.getNameOfApi(api)
        }
    });

    // We go through each API to process and match it with an existing POSTMAN Collections
    for(const api of apisToProcessStructures){

        const noMatch = collections.find(collection => collection.name === api.name) === undefined;
        const collectionVersion = collections.find(
            collection => collection.name.split(" (")[0] === api.name.split(" (")[0]
                && utils.extractVersionNumber(api.name) > utils.extractVersionNumber(collection.name)
        );
        const collectionExactMatch = collections.find(
            collection => collection.name.split(" (")[0] === api.name.split(" (")[0]
        );

        // We have a match and with a higher version, in which case we have to update the collection
        if(collectionVersion){
            console.log(`Updating collection ${collectionVersion.name} with ${api.name}`);
            await postman.updateCollection(api.filepath, collectionVersion.id, POSTMAN_API_KEY)

        }
        // Or no match at all, in which case we should create a new collection
        if(noMatch){
            console.log(`Creating collection ${api.name}`);
            await postman.createCollection(api.filepath, POSTMAN_WORKSPACE_ID, POSTMAN_API_KEY);

        }
        // We have an exact match, not doing anything but logging it for safety
        if(collectionExactMatch){
            console.log(`Collection ${api.name} already exists`);
        }
        // otherwise, we don't quite know what happened, so we log it
        else{
            console.log(`No action for ${api.name}. Shouldn't happen!`);
        }
    }
}

const path = "../adyen-postman/postman";
const apiFiles = await utils.getFilesInFolder(path, ".json");
const apiFilesWithPath = apiFiles.map((file) => {  return `${path}/${file}`; });
const apiFilesWithPathAsString = apiFilesWithPath.join(" ");

localRun(apiFilesWithPathAsString)
    .then( _ => {
        console.log("Finished processing!");
    })
    .catch(err => {
        console.log(err);
    });
