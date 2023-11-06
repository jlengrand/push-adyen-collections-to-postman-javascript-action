import * as core from '@actions/core';
import * as postman from './postmanLibrary.js';
import * as utils from "./utils.js";

async function run() {
    try {
        const postmanApiKey = core.getInput('postman-key');
        const pathToProcess = core.getInput('path-to-process');
        const workspaceId = core.getInput('workspace-id');

        runParameters(postmanApiKey, workspaceId, pathToProcess);

    } catch (error) {
        core.setFailed(error.message);
    }
}

export async function runParameters(postmanApiKey, workspaceId, pathToProcess){
    const filesToProcessAsList = await utils.getFilesInFolder(pathToProcess, ".json");
    const apiFilesWithPath = filesToProcessAsList.map((file) => {  return `${pathToProcess}/${file}`; });

    console.log(`Path to process : ${pathToProcess}`);
    console.log(`Files to process : ${apiFilesWithPath}`);
    console.log(`Getting workspace ${workspaceId}!`);
    

    const workspace = await postman.getWorkspace(workspaceId, postmanApiKey);

    const collections = workspace.workspace.collections;

    const apisToProcess = utils.filenamesToSet(apiFilesWithPath);

    const apisToProcessStructures = apisToProcess.map((api) => {
        console.log(`Processing ${api}`);
        return {
            "filepath": api,
            "name" : utils.getNameOfApi(api)
        }
    });

    // We go through each API to process and match it with an existing POSTMAN Collections
    for(const api of apisToProcessStructures){

        // It may be possible that the workspace does not contain any collection, in which case we always create
        if(collections === undefined){
            console.log(`Creating collection ${api.name}`);
            await postman.createCollection(api.filepath, workspaceId, postmanApiKey);
        }
        else{
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
                console.log(`Updating collection ${collectionVersion.name} id ${collectionVersion.uid} with ${api.name}`);
                await postman.updateCollection(api.filepath, collectionVersion.uid, postmanApiKey)

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
