const Line = require('@line/bot-sdk');
const Aws = require('aws-sdk');
const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN;
const channelSecret = process.env.CHANNEL_SECRET;

const client = new Line.Client({channelAccessToken: channelAccessToken});
const translate = new Aws.Translate();
const s3 = new Aws.S3();

const getContent = (messageId) => {
    return new Promise((resolve, reject) => {
        client.getMessageContent(messageId).then((stream) => {
            let content = [];
            stream.on('data', (chunk) => {
                console.log('data');
                console.log(chunk);
                content.push(new Buffer(chunk));
            }).on('error', (err) => {
                reject(err);
            }).on('end', function(){
                console.log('end');
                console.log(content);
                resolve(Buffer.concat(content));
            });
        });
    });
};


exports.handler = async(event) => {
    console.log(JSON.stringify(event));

    //Validate signature
    if (!Line.validateSignature(event.body, channelSecret, event.headers['x-line-signature'])) return { statusCode: 400 };

    const messages = JSON.parse(event.body);

    //Validate webhook from LINE Developers
    if (messages.events[0].replyToken === '00000000000000000000000000000000' || messages.events[0].replyToken === 'ffffffffffffffffffffffffffffffff' ) return { statusCode: 200, body: 'OK'};

    for (let i = 0; i<messages.events.length; i++) {
        if (messages.events[i].type === 'message') {
            let text;
            if (messages.events[i].message.type === 'text') {
                const param = {
                    SourceLanguageCode: 'en',
                    TargetLanguageCode: 'ja',
                    Text: messages.events[i].message.text
                };
                const result = await translate.translateText(param).promise();
                text = [{
                    type: 'text',
                    text: result.TranslatedText
                }];
            } else if (messages.events[i].message.type === 'audio') {
                const param = {
                    Body: await getContent(messages.events[i].message.id),
                    Bucket: process.env.TRANSCRIBE_BUCKET_NAME,
                    Key: `${messages.events[i].message.id}.m4a`
                };
                const result = await s3.putObject(param).promise();
                text = [{
                    type: 'text',
                    text: 'アップロードしました、音声を解析中です。'
                }];
            } else {
                text = [{
                    type: 'text',
                    text: 'テキストか音声でメッセージ送信してね。'
                }];
            }

            await client.replyMessage(messages.events[i].replyToken, text);
        }
    }

    return { statusCode: 200, body: 'OK'};
};