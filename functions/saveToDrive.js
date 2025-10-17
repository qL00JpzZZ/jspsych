// ファイルパス: functions/saveToDrive.js

// 'require' の代わりに 'import' を使うのがモダンな書き方です
import { google } from 'googleapis';

// Cloudflare Pages Functions の正しい形式
export async function onRequest(context) {
  // 1. 環境変数を context.env から取得する
  const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_DRIVE_FOLDER_ID } = context.env;

  // 2. リクエストされたデータを context.request から JSON として受け取る
  const experimentData = await context.request.json();

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        // 改行文字を正しく復元する処理は同じ
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: experimentData.filename,
      parents: [GOOGLE_DRIVE_FOLDER_ID],
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
    return new Response(JSON.stringify({ message: 'Result saved successfully!' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    // コンソールにエラーを出力し、エラー応答を返す
    console.error('Error saving to Google Drive:', error);
    return new Response(JSON.stringify({ error: 'Failed to save result.', details: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}