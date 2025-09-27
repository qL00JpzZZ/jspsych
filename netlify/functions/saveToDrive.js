// ファイルパス: netlify/functions/saveToDrive.js または api/saveToDrive.js

const { google } = require('googleapis');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const experimentData = JSON.parse(event.body);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
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
      // 【↓↓↓ この1行を追加してください ↓↓↓】
      supportsAllDrives: true,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Result saved successfully!' }),
    };

  } catch (error) {
    console.error('Error saving to Google Drive:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save result.', details: error.message }),
    };
  }
};