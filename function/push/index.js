const Line = require('@line/bot-sdk');
const Aws = require('aws-sdk');
const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN;
const client = new Line.Client({channelAccessToken: channelAccessToken});
const s3 = new Aws.S3();

exports.handler = async(event) => {
    console.log(JSON.stringify(event));

    for (let i = 0; i < event.Records.length; i++) {
        let key = event.Records[i].s3.object.key;
        let param = {
            Key: key,
            Bucket: event.Records[i].s3.bucket.name
        };
        let result = await s3.getObject(param).promise();
        console.log(JSON.stringify(result));

        let body = JSON.parse(result.Body.toString());

        let cutPos = key.indexOf('_');
        let userId = key.substring(cutPos, -1);

        let message = [{
            type: 'text',
            text: 'Amazon Transcribeの解析結果です。'
        },{
            type: 'text',
            text: body.results.transcripts[0].transcript
        }];

        await client.pushMessage(userId, message);
    }

    return { statusCode: 200, body: 'OK' };
};