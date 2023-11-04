import * as https from 'https';
import fs from "fs";

/**
 * Retrieves the workspace with the given workspaceId using the POSTMAN API
 *
 * You can find sample responses to the API in the samples/payloads folder
 *
 * @param {string} workspaceId the id of the workspace to retrieve
 * @param {string} postmanApiKey the API key to use to access the POSTMAN API
 * @returns {Promise<Object>} a promise containing the workspace
 * {@link https://www.postman.com/postman/workspace/postman-public-workspace/documentation/12959542-c8142d51-e97c-46b6-bd77-52bb66712c9a POSTMAN API documentation}
 */
export async function getWorkspace(workspaceId, postmanApiKey) {
    const options = {
        hostname: 'api.getpostman.com',
        port: 443,
        path: '/workspaces/'+workspaceId,
        method: 'GET',
        headers: {
            'X-Api-Key': postmanApiKey
        }
    }

    return new Promise((resolve, reject) => {

        const req = https.request(options, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                console.log("Error in getWorkspace - workspaceId:" + workspaceId);
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

/**
 * Creates a new POSTMAN collection in the given workspace.
 * @param {string} apiFile the path to the API file to use to create the collection. The file should be a JSON file in POSTMAN format
 * @param {string} workspaceId the id of the workspace to create the collection in
 * @param {string} postmanApiKey the API key to use to access the POSTMAN API
 * @returns {Promise<Object>} a promise containing the created collection
 */
export async function createCollection(apiFile, workspaceId, postmanApiKey) {
    const collection = JSON.parse(fs.readFileSync(apiFile, 'utf8'));
    const postData = JSON.stringify({
        "collection": collection,
    });

    const options = {
        hostname: 'api.getpostman.com',
        port: 443,
        path: '/collections/?workspace='+workspaceId,
        method: 'POST',
        headers: {
            'X-Api-Key': postmanApiKey,
            'Content-Type': 'application/json'
        }
    }

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                console.log("Error in createCollection - workspaceId:" + workspaceId);
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

        req.write(postData);
        req.end();
    });
}

/**
 * Creates a new POSTMAN collection in the given workspace.
 * @param {string} apiFile the path to the API file to use to create the collection. The file should be a JSON file in POSTMAN format
 * @param {string} collectionId the id of the collection to update
 * @param {string} postmanApiKey the API key to use to access the POSTMAN API
 * @returns {Promise<Object>} a promise containing the updated collection
 */
export async function updateCollection(apiFile, collectionId, postmanApiKey) {
    const collection = JSON.parse(fs.readFileSync(apiFile, 'utf8'));
    const postData = JSON.stringify({
        "collection": collection,
    });

    const options = {
        hostname: 'api.getpostman.com',
        port: 443,
        path: '/collections/'+ collectionId,
        method: 'PUT',
        headers: {
            'X-Api-Key': postmanApiKey,
            'Content-Type': 'application/json'
        }
    }

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                console.log("Error in updateCollection - collectionId:" + collectionId);
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

        req.write(postData);
        req.end();
    });
}
