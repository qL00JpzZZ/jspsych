const { google } = require('googleapis');

exports.handler = async function (event) {
  // Cloudflare Pagesでは、event.bodyは直接文字列として渡されることが多い
  // そのため、リクエストが文字列かオブジェクトかを判定して適切にパースする
  const experimentData = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // 環境変数から秘密鍵を読み込む際、改行文字を正しく復元する
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
      // 共有ドライブに保存する場合に必要な設定
      supportsAllDrives: true,
    });
    
    // Cloudflare Pagesの関数はResponseオブジェクトを返す必要がある
    return new Response(JSON.stringify({ message: 'Result saved successfully!' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error saving to Google Drive:', error);
    // エラー時もResponseオブジェクトを返す
    return new Response(JSON.stringify({ error: 'Failed to save result.', details: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};