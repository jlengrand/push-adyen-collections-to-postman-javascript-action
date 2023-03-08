import * as core from '@actions/core';
import * as github from '@actions/github';
import * as postman from './postmanLibrary.js';

async function run() {

    try {
        const postmanApiKey = core.getInput('postman-key');
        const filesChanged = core.getInput('files-changed');
        const workspaceId = core.getInput('workspace-id');

        const zeFiles = filesChanged.split(' ');

        console.log(`Hello ${postmanApiKey}!`);
        console.log(`Hello ${workspaceId}!`);
        console.log(`Hello ${filesChanged}!`);

        // Get the JSON webhook payload for the event that triggered the workflow
        // const payload = JSON.stringify(github.context.payload, undefined, 2)
        // console.log(`The event payload: ${payload}`);

        // Get the list of collections in the workspace
        const workspace = await postman.getWorkspace(workspaceId, postmanApiKey);

        console.log(`The workspace:`);
        console.log(JSON.stringify(workspace, null, 4));

        const time = (new Date()).toTimeString();
        core.setOutput("time", time);

    } catch (error) {
        core.setFailed(error.message);
    }
}


run()