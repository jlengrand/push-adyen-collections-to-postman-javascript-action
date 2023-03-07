const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');


async function run() {

    try {
        const postmanApiKey = core.getInput('postman-key');
        const filesChanged = core.getInput('files-changed');
        const workspaceId = core.getInput('workspace-id');

        const zeFiles = filesChanged.split(' ');

        console.log(`Hello ${postmanApiKey}!`);
        console.log(`Hello ${workspaceId}!`);
        console.log(`Hello ${filesChanged}!`);

        const time = (new Date()).toTimeString();
        core.setOutput("time", time);

        // Get the JSON webhook payload for the event that triggered the workflow
        // const payload = JSON.stringify(github.context.payload, undefined, 2)
        // console.log(`The event payload: ${payload}`);

        // Get the list of collections in the workspace
        const collections = await getCollectionsInWorkspace(workspaceId, postmanApiKey);

        console.log(`The collections: ${collections}`);


    } catch (error) {
        core.setFailed(error.message);
    }
}


async function getCollectionsInWorkspace(workspaceId, postmanApiKey) {
    const options = {
        hostname: 'api.getpostman.com',
        port: 443,
        path: '/workspaces/'+workspaceId+'/collections',
        method: 'GET',
        headers: {
            'X-Api-Key': postmanApiKey
        }
    }


    return new Promise((resolve, reject) => {

        const req = https.request(options, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }

            let body = [];
            res.on('data', (chunk) => {
                body.push(chunk);
            });

            res.on('end', () => {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch (e) {
                    reject(e);
                }
                resolve(body);
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
}


run()