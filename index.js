import * as core from '@actions/core';
import * as postman from './postmanLibrary.js';
import * as utils from "./utils.js";

async function run() {
    try {
        const postmanApiKey = core.getInput('postman-key');
        const filesChanged = core.getInput('files-changed');
        const workspaceId = core.getInput('workspace-id');

        const time = runParameters(postmanApiKey, workspaceId, filesChanged);
        core.setOutput("time", time);

    } catch (error) {
        core.setFailed(error.message);
    }
}

export async function runParameters(postmanApiKey, workspaceId, filesToProcess){

    console.log(`Files to process : ${filesToProcess}`);
    
    console.log(`Getting workspace ${workspaceId}!`);
    
    console.log("-----");

    const workspace = await postman.getWorkspace(workspaceId, postmanApiKey);

    console.log(JSON.stringify(workspace));
    console.log("-----");

    
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
            await postman.updateCollection(api.filepath, collectionVersion.id, postmanApiKey)

        }
        // Or no match at all, in which case we should create a new collection
        else if(noMatch){
            console.log(`Creating collection ${api.name}`);
            await postman.createCollection(api.filepath, workspaceId, postmanApiKey);

        }
        // We have an exact match, not doing anything but logging it for safety
        else if(collectionExactMatch){
            console.log(`Collection ${api.name} already exists`);
        }
        // otherwise, we don't quite know what happened, so we log it
        else{
            console.log(`No action for ${api.name}. Shouldn't happen!`);
        }
    }
    console.log("Finished processing files!");
}

run()
    .then( _ => {
        console.log("Finished action!");
    })
    .catch(err => {
        console.log(err);
    });
