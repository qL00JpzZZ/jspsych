// ファイルパス: netlify/functions/saveToTrive.js

// Google APIクライアントライブラリをインポートします
const { google } = require('googleapis');

// Netlify Functionsのメイン処理部分です
exports.handler = async function(event) {
  // セキュリティ対策として、POSTリクエスト以外は受け付けないようにします
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 1. クライアント（ブラウザ）から送られてきた実験データ（JSON形式）を解析します
    const experimentData = JSON.parse(event.body);

    // 2. Google Drive APIで認証を行います
    // 事前にNetlifyで設定した環境変数を安全に読み込みます
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // Netlifyの環境変数に登録した秘密鍵は改行が\\nに変換されるため、\nに戻します
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      // この関数がGoogle Driveのファイル操作権限を持つことを宣言します
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // 3. Google Driveに保存するファイルの情報（メタデータ）と内容を準備します
    const fileMetadata = {
      // ファイル名を設定します。重複しないように現在時刻を入れています
      name: `experiment_result_${new Date().toISOString()}.csv`,
      // 保存先のフォルダIDを環境変数から取得します
      parents: [process.env.GOOGLE_FOLDER_ID]
    };
    const media = {
      mimeType: 'text/csv',
      body: experimentData.csv // クライアントから送られてきたCSVデータをそのまま使用
    };

    // 4. Drive APIを呼び出して、実際にファイルを作成（アップロード）します
    await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });

    // 5. 成功したことをクライアントに伝えるための応答を返します
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Result saved successfully!' })
    };

  } catch (error) {
    // 6. 何かエラーが発生した場合、その内容をログに出力し、クライアントにもエラーを伝えます
    console.error('Error saving to Google Drive:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save result.' })
    };
  }
};