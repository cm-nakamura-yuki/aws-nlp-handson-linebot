# はじめての自然言語処理（NLP：Natural Language Processing）ハンズオン
## LINE Botを作成する
このLINE Botではテキスト送信、音声送信を受け付けることができます。テキスト送信する場合は英語で送信してみてください。Amazon Translateを使い、日本語へ翻訳したテキストを返します。[the japan times alpha](https://alpha.japantimes.co.jp/) などを利用すると和訳も読むことができます。こちらのテキストを送信することでAmazon Translateのパワーを確認できるはずです。  

![sample-1](sample-1.png)

音声送信の場合は、日本語でLINE Botに話しかけてみてください。音声をS3にアップロードして音声文字起こしを開始します。文字起こしが完了するとテキストがLINE Botに送信されます。

![sample-2](sample-2.png)

### LINE Developers
LINE Botを作成するために、LINE Developersへの登録が必要となります。

[Messaging APIを利用するには](https://developers.line.biz/ja/docs/messaging-api/getting-started/#%E3%83%81%E3%83%A3%E3%83%8D%E3%83%AB%E3%81%AE%E4%BD%9C%E6%88%90) を参考にLINE Developersコンソールにログインし、チャネルの種類：**Messaging API**作成してください。

作成が完了したら、チャネルシークレットとチャネルアクセストークン（ロングターム）を取得しメモしておきます。  

#### チャネルシークレット
チャネルのページにアクセスしスクロールしていくと項目があります。発行をクリックし、発行されたシークレットをメモしておいてください。

![line-1](./images/line-1.png)

![line-2](./images/line-2.png)

#### チャネルアクセストークン
Messaging API設定のタブにアクセスし、スクロールするとチャネルアクセストークンの項目があります。発行をクリックしチャネルアクセストークンをメモしておいてください。

![line-3](./images/line-3.png)

### AWS IAM
AWS Lambdaに利用するIAMロールを作成します。IAMのロールへアクセスしてください。ロールを作成をクリックしてください。

![iam-1](./images/iam-1.png)

Lambda用のロールを作成するので、サービスでLambdaを選択してアクセス権限をクリックしてください。

![iam-2](./images/iam-2.png)

Lambda関数からAmazon Translate, Amazon S3, Cloud Watch Logsへアクセスが必要なのでポリシーを選択し次のステップ：タグをクリックしてください。

追加するポリシーはAWSのマネージドポリシーを利用します。

* TranslateFullAccess
* AmazonS3FullAccess
* CloudWatchLogsFullAccess

![iam-3](./images/iam-3.png)
![iam-4](./images/iam-4.png)
![iam-5](./images/iam-5.png)
![iam-6](./images/iam-6.png)

タグの設定はスキップし、作成するロールの確認後ロールの作成をクリックします。ロールが正常に作成されるとメッセージが表示されます。

![iam-7](./images/iam-7.png)
![iam-8](./images/iam-8.png)

### Amazon S3
LINE Botから送信される音声を保存するS3バケットを作成します。S3にアクセスし、バケットを作成するをクリックしてください。

![s3-1](./images/s3-1.png)

バケットを作成するをクリック、任意のバケット名を入力し作成をクリックしてください。

![s3-2](./images/s3-2.png)

作成が完了すると、バケット一覧にバケット名が表示されます。

![s3-3](./images/s3-3.png)

### AWS Lambda



### Amazon API Gateway