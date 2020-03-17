const Aws = require('aws-sdk');
const Transcribe = new Aws.TranscribeService();

exports.handler = async(event) => {
    console.log(JSON.stringify(event));
    for (let i = 0; i < event.Records.length; i++) {
        let param = {
            LanguageCode: 'ja-JP',
            Media: {
                MediaFileUri: `s3://${event.Records[i].s3.bucket.name}/${event.Records[i].s3.object.key}`
            },
            TranscriptionJobName: `${event.Records[i].s3.object.key}`,
            MediaFormat: 'mp4',
            OutputBucketName: process.env.OUTPUT_BUCKET
        };

        const result = await Transcribe.startTranscriptionJob(param).promise();
        console.log('start... ' + JSON.stringify(result));
    }

    return {
        statusCode: 200,
        body: 'OK'
    };
};