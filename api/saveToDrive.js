// ファイルパス: api/saveToDrive.js

const { google } = require('googleapis');

// Vercelのサーバーレス関数の標準的な形式
export default async function handler(req, res) {
  // VercelではPOST以外のメソッドを拒否するのが一般的
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // リクエストの本文（JSON）を取得
  const experimentData = req.body;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // 環境変数から秘密鍵を読み込む処理は同じ
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: experimentData.filename,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: 'text/csv',
      body: experimentData.csv,
    };

    await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
      supportsAllDrives: true,
    });

    // 成功時の応答を返す
    res.status(200).json({ message: 'Result saved successfully!' });

  } catch (error) {
    // エラー時の応答を返す
    console.error('Error saving to Google Drive:', error);
    res.status(500).json({ error: 'Failed to save result.', details: error.message });
  }
}