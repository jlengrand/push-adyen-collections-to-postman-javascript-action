const core = require('@actions/core');
const github = require('@actions/github');


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
        const collections = await getCollectionsInWorkspace(workspaceId, postmanApiKey);

        console.log(`The collections: ${collections}`);

        const time = (new Date()).toTimeString();
        core.setOutput("time", time);


    } catch (error) {
        core.setFailed(error.message);
    }
}


run()