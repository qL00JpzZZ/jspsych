// ファイルパス: netlify/functions/saveToDrive.js

const { google } = require('googleapis');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 1. クライアント（ブラウザ）から送られてきた実験データを解析
    const experimentData = JSON.parse(event.body);

    // 2. Google Drive APIで認証
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // 3. ファイルメタデータと内容を準備
    const fileMetadata = {
      name: experimentData.filename || `experiment_result_${new Date().toISOString()}.csv`,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // ← 修正
    };
    const media = {
      mimeType: 'text/csv',
      body: experimentData.csv, // CSV文字列
    };

    // 4. Drive APIを呼び出してファイルをアップロード
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name, parents',
    });

    // 5. 成功レスポンスにファイル情報を含めて返す
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Result saved successfully!',
        id: file.data.id,
        name: file.data.name,
        folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
      }),
    };

  } catch (error) {
    console.error('Error saving to Google Drive:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save result.', detail: error.message }),
    };
  }
};
