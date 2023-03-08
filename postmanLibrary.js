const https = require('https');

exports.getCollectionsInWorkspace= async function(workspaceId, postmanApiKey) {
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