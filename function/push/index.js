const Line = require('@line/bot-sdk');
const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN;
const client = new Line.Client({channelAccessToken: channelAccessToken});

exports.handler = async(event) => {
    console.log(JSON.stringify(event));


    return { statusCode: 200, body: 'OK'};
};