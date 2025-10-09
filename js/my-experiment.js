// -------------------- ヘルパー関数 --------------------
// ファイル名に使えない文字を置換・削除する
function sanitizeFileNamePart(s) {
  if (!s) return 'unknown';
  return String(s).trim().replace(/[,\/\\()?%#:*"|<>]/g, '_').replace(/\s+/g, '_').slice(0, 50);
}
// 正答率を計算・フォーマットする
function formatPercentFraction(correctCount, totalCount) {
  if (totalCount === 0) return 'N/A';
  const percent = (correctCount / totalCount) * 100;
  return `${percent.toFixed(1)}%`;
}

// -------------------- サーバー送信関数 --------------------
async function saveCsvToServer(filename, csvText) {
  try {
    const response = await fetch('/.netlify/functions/saveToDrive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: filename, csv: csvText })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Server error: ${response.status} - ${errorData.error}`);
    }
    const result = await response.json();
    console.log('サーバーからの応答:', result);
    return result;
  } catch (error) {
    console.error('結果の保存に失敗しました:', error);
    throw error;
  }
}

// -------------------- jsPsychの初期化 --------------------
let participantInitials = 'unknown';

const jsPsych = initJsPsych({
  on_finish: async function() {
    jsPsych.getDisplayElement().innerHTML = '<p style="font-size: 20px;">結果を保存しています。しばらくお待ちください...</p>';
    
    let csvData = jsPsych.data.get().csv();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${participantInitials}_${timestamp}.csv`;

    try {
      await saveCsvToServer(filename, csvData);
      jsPsych.getDisplayElement().innerHTML = '<div style="text-align: center; max-width: 800px; font-size: 20px;"><h2>実験終了</h2><p>結果は正常に保存されました。</p><p>ご協力いただき、誠にありがとうございました。このウィンドウを閉じて実験を終了してください。</p></div>';
    } catch (err) {
      jsPsych.getDisplayElement().innerHTML = '<div style="text-align: center; max-width: 800px; font-size: 20px;"><h2>エラー</h2><p>エラーが発生し、結果を保存できませんでした。</p><p>お手数ですが、実験実施者にお知らせください。</p></div>';
    }
  }
});

// -------------------- イニシャル入力試行 --------------------
const initials_trial = {
  type: jsPsychSurveyText,
  questions: [
    { prompt: "実験を開始します。あなたのイニシャルを半角英数字で入力してください（例: ST）", name: "initials", required: true, placeholder: "例: ST" }
  ],
  button_label: "同意して実験を開始する",
  on_finish: function(data) {
    participantInitials = sanitizeFileNamePart(data.response.initials);
    jsPsych.data.addProperties({participant_initials: participantInitials});
  }
};

// -------------------- 説明文の定義 --------------------
const instructions_start = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <div style="max-width: 800px; text-align: left; line-height: 1.6;">
            <p><strong>【実験の目的】</strong></p>
            <p>本実験の目的は、人間の記憶メカニズム、特にエピソード記憶における視聴覚情報の統合過程を調査することです。具体的には、視覚情報（風景画像）と聴覚情報（無意味な音節）が同時に提示された際に、それらがどのように記憶内で関連付けられ、後の記憶再生にどのような影響を与えるかを検証します。</p>
            <p><strong>【実験の流れ】</strong></p>
            <p>実験は、大きく分けて「学習フェーズ」と「テストフェーズ」の2つの段階で構成されます。</p>
            <ol>
                <li><strong>学習フェーズ</strong><br>
                画面に風景画像（屋内または屋外）が1枚ずつ表示され、それと同時に短い音声が再生されます。あなたの課題は、表示された画像が「屋内」のものか「屋外」のものかを判断し、できるだけ速く、正確にキーボードのキーを押して回答することです。<br>
                <br>
                <strong>・屋内画像の場合：「J」キー</strong><br>
                <strong>・屋外画像の場合：「K」キー</strong><br>
                <br>
                このフェーズでは、合計120枚の画像と音声のペアが提示されます。画像のカテゴリ判断に集中してください。</li>
                <br>
                <li><strong>テストフェーズ</strong><br>
                学習フェーズで記憶した内容に関するテストを行います。テストは「画像再認テスト」と「音声ペア再認テスト」の2種類です。詳細は各テストの直前に説明します。</li>
            </ol>
            <p><strong>【所要時間と注意点】</strong></p>
            <p>実験全体の所要時間は約15〜20分です。実験中は、静かで集中できる環境でご参加ください。また、PCのスピーカーまたはイヤホンから音声が聞こえる状態にしてください。</p>
            <p>準備ができましたら、何かキーを押して最初の課題（学習フェーズ）を開始してください。</p>
        </div>
    `,
    post_trial_gap: 500
};
const break_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <div style="max-width: 800px; text-align: center; line-height: 1.6;">
            <p>ここで一度休憩を取ります。</p>
            <p>学習フェーズはこれで半分終了です。</p>
            <p>準備ができましたら、<strong>スペースキー</strong>を押して後半を開始してください。</p>
        </div>
    `,
    choices: [' '],
    post_trial_gap: 500
};
const instructions_test_start = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <div style="max-width: 800px; text-align: left; line-height: 1.6;">
            <p>学習フェーズは終了です。お疲れ様でした。</p>
            <p>これから、テストフェーズを開始します。テストは2種類あります。</p>
            <br>
            <p><strong>1. 画像再認テスト</strong></p>
            <p>画面に1枚ずつ画像が表示されます。その画像が、先ほどの学習フェーズで提示されたものかどうかを判断してください。</p>
            <p><strong>・学習フェーズで見た画像の場合：「J」キー</strong></p>
            <p><strong>・学習フェーズで見ていない新しい画像の場合：「K」キー</strong></p>
            <br>
            <p><strong>2. 音声ペア再認テスト</strong></p>
            <p>まず「1組目」として音声のペアが再生され、続いて「2組目」として別の音声ペアが再生されます。2つのペアのうち、どちらが学習フェーズで画像と同時に提示されたペアだったかを判断してください。</p>
            <p><strong>・1組目が学習したペアの場合：「J」キー</strong></p>
            <p><strong>・2組目が学習したペアの場合：「K」キー</strong></p>
            <br>
            <p>どちらのテストも、できるだけ速く、正確に回答するよう心がけてください。</p>
            <p>準備ができましたら、何かキーを押して最初のテスト（画像再認テスト）を開始してください。</p>
        </div>
    `,
    post_trial_gap: 500
};

// --- 画像ファイルリスト ---
const raw_image_files = {
  INDOOR: {
    grocerystore: [
      '08082003_aisle.jpg', 'Picture_22.jpg', 'supermarche3-1.jpg', 'duroseshopDM1710_468x527.jpg', 'shop17.jpg', 'kays-1.jpg', 'int89.jpg', '22184680.jpg', 'APRIL242002FakeGroceryStore.jpg', 'supermarket.jpg', 'shop13.jpg', 'shop16.jpg', '1798025006_f8c475b3fd.jpg', 'Inside the supermarket.jpg', 'shop18.jpg', '44l.jpg', 'cbra3.jpg', 'MainFoodStoreProduce1.jpg', 'supermarche33-1.jpg', 'integral-color4_detail.jpg', 'grocery.jpg', 'grocery-store-740716-1.jpg', 'ahpf.supermarche4.jpg', 'supermarket66.jpg', 'coffee_sold_supermarket_1.jpg', 'shop30.jpg', 'super_market.jpg', 'shop14.jpg', 'int131.jpg', 'int576.jpg', 'int606.jpg', 'int112.jpg',
    ],
    library: [
      'library_journals_books.jpg', 'Bibliotheque6.jpg', 'library2.jpg', '763634302_e25f44402d.jpg', 'Library Pictures.jpg', 'Library_P2150016.jpg', 'danielkimberlylibrarycl1.jpg', 'howland.jpg', 'JPB_Library.jpg', '57048683_74701f9fa9.jpg', 'library4.jpg', '43407107_204b8504b5.jpg', 'meura1.jpg', 'biblio01.jpg', 'Dsc00613-3.jpg', 'library bookshelves large.jpg', 'bookstore_more_books.jpg', 'Library Pictures (3).jpg', 'BM_Frejus Bibliotheque 1.jpg', '34_AvH_014_library_stacks.jpg', 'association_bibliotheque.jpg', 'ins19.jpg', 'Day100006web.jpg', 'Fairfield_Pub_Library_A.jpg', 'image bibliotheque.jpg', 'ccls-img-buildingbos.jpg', 'New York Public Library5.jpg', 'bibliotheque55.jpg', 'Homework2.jpg', 'ins18.jpg', 'Library98.jpg', 'library466.jpg', '28-06-06 Biblioth_que Municipale (19).jpg', 'library05.jpg', 'bibliotheque_photo.jpg', 'la_bibliotheque_de_la_tour_du_valat.jpg', 'ins21.jpg', 'DSC02518.jpg', 'library02.jpg', 'fibiba1.jpg', 'bibliotheque_0908.jpg', '130309783_f194f43f71.jpg', 'image_preview.jpg', 'librairie-16.jpg', 'library04.jpg', 'inside01.jpg', 'library01.jpg', 'neilson-hays-library02.jpg', 'gallerie-1130426509812-81.80.90.133.jpg', 'int91.jpg', 'library03.jpg', '473767793_d3cafc4eff.jpg', 'mainLibrary.jpg', 'librairie.jpg', 'Bibliotheque_01.jpg', '470618728_18b5550006.jpg', '207157437_14c21369e9.jpg', 'fine_arts.jpg', 'library5.jpg', 'Concord_Free_Public_Library_Renovation_122.jpg',
    ],
    restaurant: [
      'int112.jpg', 'restau79c.l.jpg', 'Restau52C.L.jpg', 'INT236.jpg', '2006_11_tastingroom.jpg', 'int576.jpg', 'N190059.jpg', 'room251.jpg', 'int803.jpg', 'OriginalSteakhouse.jpg', 'gaststaette1.jpg', 'int863.jpg', 'room230.jpg', 'olis.small.jpg', 'N190036.jpg', 'room172.jpg', 'restau.14.jpg', 'food2_450.jpg', 'restau.17.jpg', 'int862.jpg', 'int579.jpg', 'gaststaette15.jpg', 'Gaststatte_kl.jpg', 'restau.15.jpg', 'room149.jpg', 'food4_450.jpg', 'restau.04.jpg', 'room171.jpg', 'restau.02.jpg', 'int578.jpg', 'gaststaette5.jpg', 'Bertucci_01_lg.jpg', 'Restau33C.L.jpg', 'int608.jpg', 'room143.jpg', 'RestauC.L.jpg', 'int603.jpg', '19165-298-298-1-0.jpg', 'restau.18.jpg', 'room252.jpg', 'Kulturhaus_kneipe.jpg', 'mortonsdr.jpg', 'int607.jpg', 'int604.jpg', 'room176.jpg', 'int577.jpg', 'int90.jpg', 'restau.01.jpg', 'int783.jpg', 'int606.jpg', 'int60.jpg', 'restau.08.jpg', 'restau.12.jpg', 'room106.jpg', 'restau.19.jpg', 'restau30C.L.jpg', 'room250.jpg', 'int867.jpg',
    ],
    kitchen: [
      'cdmc1170.jpg', 'dining047.jpg', 'cdmc1123.jpg', 'cdmc1178.jpg', 'cdmc1144.jpg', 'k4.jpg', 'int362.jpg', 'int34.jpg', 'kitchen083.jpg', 'cdmc1120.jpg', 'int35.jpg', 'int423.jpg', 'iclock.jpg', 'k11.jpg', 'kitchen003.jpg', 'cdmc1145.jpg', 'cdmc1289.jpg', 'cdMC1148.jpg', 'cdmc1143.jpg', 'cdmc1126.jpg', 'kitchen031.jpg', 'int360.jpg', 'int166.jpg', 'int437.jpg', 'cdmc1151.jpg', 'k2.jpg', 'kitchen5.jpg', 'cdmc1128.jpg', 'kitchen077.jpg', 'int474.jpg', 'cdmc1172.jpg', 'cdmc1146.jpg', 'int422.jpg', 'cdMC1154.jpg', 'int347.jpg', 'cdmc1299.jpg', 'kitchen081.jpg', 'k9.jpg', 'k6.jpg', 'k8.jpg', 'cdmc1119.jpg', 'cdmc1167.jpg', 'aa014484.jpg', 'kitchen004.jpg', 'k3.jpg', 'kitchen086.jpg', 'int365.jpg', 'cdmc1164.jpg', 'kitchen032.jpg', 'k5.jpg', 'int357.jpg', 'k7.jpg', 'k12.jpg', 'k1.jpg', 'k10.jpg', 'cdmc1175.jpg', 'int396.jpg', 'cdmc1194.jpg', 'kitchen054.jpg', 'aa041720.jpg',
    ],
    gym: [
      'csu6.jpg', 'gym13.jpg', 'bg-gym2.jpg', 'SALLE3.jpg', 'room399.jpg', 'gym09.jpg', 'fitness_center3.jpg', 'Image_Grande72.jpg', 'salle-cardio-grand.jpg', 'herade_inside.jpg', 'salle_1.jpg', 'ucc_gym_photos_bg.jpg', 'montreal_octo 030.jpg', 'fieldhouse-weightroom.jpg', 'gym_b4.jpg', 'guyane_muscul.jpg', 'Gym-Equipment.jpg', 'gym04.jpg', 'gym03.jpg', 'MSAC_Gym_-_20061515.jpg', 'room424.jpg', 'salle_9.jpg', 'gym06.jpg', 'int838.jpg', 'Gym432.jpg', 'gym_b.jpg', 'url.jpg', 'gym65.jpg', 'saledemuscu11.jpg', 'int525.jpg', 'uploads-images-photos_images-fullsize-gym.jpg', 'hotel-megeve-11.jpg', 'Gym05.jpg', 'Proflex gym lagos nigeria 4.jpg', 'junglegym-60.jpg', 'Photo-008.jpg', 'media40037.jpg', 'gym07.jpg', 'gym3.jpg', 'refurbished-gym-equipment.jpg', 'southglade_gym-2.jpg', 'HO-00-01-5186-23_l.jpg', 'necker_salle_de_gym_reference.jpg', 'Gym2_000.jpg', 'web-cardio-theatre-gym.jpg', 'biosite-gym.jpg', 'p1a.jpg', 'media39989.jpg', 'SalleMuscu.jpg', 'gym_left.jpg', 'gym45.jpg', 'gym08.jpg', 'gym14.jpg', 'gym2.jpg', 'room398.jpg', 'HO-00-02-5304-28A_l.jpg', 'GymInt1.jpg', 'gym001.jpg'
    ]
  },
  OUTDOOR: {
    castle: [
      'chateau_v.jpg', 'FreeFoto_castle_1_40.jpg', 'chateau-chillon-1.jpg', 'chenonceaux-chateau-de-chenonceau-chenony1-1.jpg', 'FreeFoto_castle_17_48.jpg', 'FreeFoto_castle_1_13.jpg', 'chateau_frontenac.jpg', 'chateau_barrail1.jpg', '087 Chateau Laurier.jpg', '38588-Chateau-De-Cruix-0.jpg', 'FreeFoto_castle_1_29.jpg', 'FreeFoto_castle_3_9.jpg', 'FreeFoto_castle_5_49.jpg', 'FreeFoto_castle_14_31.jpg', 'build155.jpg', 'FreeFoto_castle_16_21.jpg', 'FreeFoto_castle_1_9.jpg', 'FreeFoto_castle_16_1.jpg', 'FreeFoto_castle_8_2.jpg', 'FreeFoto_castle_1_25.jpg', 'FreeFoto_castle_1_3.jpg', 'FreeFoto_castle_17_2.jpg', 'FreeFoto_castle_9_36.jpg', 'FreeFoto_castle_16_48.jpg', 'FreeFoto_castle_14_34.jpg', 'Chateau 1-1.jpg', 'FreeFoto_castle_1_10.jpg', 'FreeFoto_castle_17_39.jpg', 'FreeFoto_castle_1_15.jpg', 'FreeFoto_castle_1_5.jpg', 'FreeFoto_castle_1_36.jpg', 'FreeFoto_castle_5_41.jpg', 'FreeFoto_castle_22_40.jpg', 'FreeFoto_castle_1_32.jpg', 'build124.jpg', 'FreeFoto_castle_8_10.jpg', 'FreeFoto_castle_15_11.jpg', 'FreeFoto_castle_1_17.jpg', 'FreeFoto_castle_1_1.jpg', 'chateau-de-losse.jpg', 'FreeFoto_castle_1_21.jpg', 'FreeFoto_castle_16_14.jpg', 'FreeFoto_castle_8_37.jpg', 'arques_chateau_3.jpg', '7_12_chateau_de_chauvac-1.jpg', 'carcassonebridge.jpg', 'FreeFoto_castle_1_26.jpg', 'FreeFoto_castle_1_38.jpg', 'FreeFoto_castle_8_29.jpg', 'FreeFoto_castle_20_49.jpg', 'Chateau D\'Usse.jpg', 'FreeFoto_castle_16_49.jpg', 'FreeFoto_castle_8_7.jpg', 'FreeFoto_castle_1_24.jpg', 'FreeFoto_castle_1_12.jpg', 'FreeFoto_castle_1_22.jpg', 'FreeFoto_castle_16_7.jpg', 'FreeFoto_castle_3_27.jpg', 'build680.jpg', 'chateau_de_bran_chateau_de_dracula.jpg',
    ],
    beach: [
      'beach_167_08_flickr.jpg', 'beach_127_15_flickr.jpg', 'beach_163_18_flickr.jpg', 'CCP0013242_P.jpg', 'bea3.jpg', 'beach_35_16_altavista.jpg', 'beach_01_05_google.jpg', 'beach_95_03_flickr.jpg', 'cdMC862.jpg', 'beach_01_02_google.jpg', 'beach_dsc00550.jpg', 'beach_167_15_flickr.jpg', 'beach_163_23_flickr.jpg', 'beach_39_09_flickr.jpg', 'bea10.jpg', 'beach_121_12_flickr.jpg', 'bea2.jpg', 'beach_28_18_flickr.jpg', 'beach_55_21_flickr.jpg', 'beach_47_02_altavista.jpg', 'beach_13_11_flickr.jpg', 'bambouseraie_45_05_google.jpg', 'beach_01_08_google.jpg', 'beach_04_06_ask.jpg', 'beach_161_11_flickr.jpg', 'beach_08_07_google.jpg', 'beach_11_02_ask.jpg', '1147453287.jpg', 'beach_01_12_flickr.jpg', 'beach_30_16_flickr.jpg', 'beach_18_22_flickr.jpg', 'beach_02_06_ask.jpg', 'beach_91_17_flickr.jpg', 'beach_26_07_flickr.jpg', 'CCP0013911_P.jpg', 'Cancun.jpg', 'CCP0012536_P.jpg', 'beach_143_14_flickr.jpg', 'beach_144_05_flickr.jpg', 'beach_01_03_altavista.jpg', 'beach_166_09_flickr.jpg', 'beach.jpg', 'beach_45_01_altavista.jpg', 'AYP0779018_P.jpg', '2006-02-13-15-28-07sml.jpg', 'beach_37_22_flickr.jpg', 'beach_08_04_ask.jpg', 'AYP0779641_P.jpg', 'bea4.jpg', 'DVP1915541_P.jpg', 'beach_51_15_altavista.jpg', 'beach_01_01_ask.jpg', 'beach_04_11_google.jpg', 'beach_19_07_altavista.jpg', 'beach_34_12_flickr.jpg', 'bea5.jpg', 'beach_01_05_askl.jpg', 'cdMC839.jpg', 'BLP0018661_P.jpg', 'beach_01_03_google.jpg',
    ],
    forest: [
      'FreeFoto_forest_3_19.jpg', 'FAN1006576_P.jpg', 'CBP1014811_P.jpg', 'forest_01_01_ask.jpg', 'cdMC349.jpg', 'forest24.jpg', 'forest25.jpg', 'FreeFoto_forest_9_7.jpg', 'AYP0783202_P-1.jpg', 'forest_11_20_yahoo.jpg', 'DVP4907648_P.jpg', 'forest_02_11_altavista.jpg', 'forest_01_01_google.jpg', 'forest05.jpg', 'CYP0800679_P.jpg', 'forest_09_05_askl.jpg', 'forest_11_06_askl.jpg', 'AGP0027965_P.jpg', 'DVP4967677_P.jpg', '36021.jpg', 'FreeFoto_forest_3_44.jpg', 'forest_31_02_altavista.jpg', 'CYP0801743_P.jpg', 'cdMC413.jpg', 'DVP4966497_P.jpg', 'DVP4962393_P.jpg', '08Trees.jpg', 'forest_18_04_askl.jpg', 'forest_11_02_altavista.jpg', 'FreeFoto_forest_11_32.jpg', 'forest_36_05_altavista.jpg', 'FreeFoto_forest_3_26.jpg', 'bambouseraie_12_10_altavista.jpg', 'CCP0014018_P-1.jpg', 'nat234.jpg', 'forest10.jpg', 'forest20.jpg', 'forest_01_02_ask.jpg', 'FreeFoto_forest_3_32.jpg', 'forest_01_02_altavista.jpg', 'forest_30_02_yahoo.jpg', 'FreeFoto_forest_2_48.jpg', 'FreeFoto_national park_10_1.jpg', '36032.jpg', 'AYP0783229_P.jpg', 'forest_32_08_altavista.jpg', 'cdMC398.jpg', 'FreeFoto_forest_3_20.jpg', 'FreeFoto_forest_11_36.jpg', 'FAN2016942_P.jpg', 'forest_17_01_askl.jpg', 'FreeFoto_forest_2_47.jpg', 'forest_05_06_askl.jpg', 'FreeFoto_forest_3_43.jpg', '482063.jpg', 'cdMC617.jpg', 'bambouseraie_02_05_altavista.jpg', 'forest13.jpg', 'forest_14_16_yahoo.jpg', 'nat408.jpg',
    ],
    desert: [
      'des22.jpg', 'NA006526.jpg', 'Desert_de_Gobi.jpg', 'beach_138_10_flickr.jpg', 'des14.jpg', 'AA019096.jpg', 'land616.jpg', 'NA004783.jpg', 'land701.jpg', 'bambouseraie_42_12_google.jpg', 'land514.jpg', 'NA001302.jpg', 'NA008867.jpg', 'beach_165_20_flickr.jpg', 'des15.jpg', 'NA006122.jpg', 'beach_40_21_flickr.jpg', 'MWP0020668_P.jpg', '611sahara.jpg', 'des13.jpg', 'beach_02_10_yahoo.jpg', 'beach_115_11_flickr.jpg', 'NA000915.jpg', 'NA004090.jpg', 'AA005954.jpg', 'cdmc795.jpg', 'beach_34_01_flickr.jpg', 'G02 Gobi Desert Sand Dunes.jpg', 'forest_34_08_altavista.jpg', 'des17.jpg', 'beach_26_19_altavista.jpg', 'BXP0035856_P.jpg', 'des18.jpg', 'land564.jpg', '800px-Towering_Sand_Dunes.jpg', '255055.jpg', 'AIP0005723_P.jpg', 'NA006111.jpg', '034medanos.jpg', 'land526.jpg', 'DVP4967429_P.jpg', 'NA006361.jpg', 'land656.jpg', 'BXP0035855_P.jpg', '50092.jpg', 'land645.jpg', 'beach_91_12_flickr.jpg', 'NA007446.jpg', 'natu539.jpg', 'mountain_10_04_askl.jpg', '480075.jpg', 'AA005940.jpg', 'Lone Palm, Sahara Desert-1.jpg', 'natu89.jpg', 'land658.jpg', 'AA020480.jpg', 'n251011.jpg', 'land657.jpg', 'des16.jpg', 'des21.jpg',
    ],
    mountain: [
      'FreeFoto_mountain_1_31.jpg', 'mountain05.jpg', 'mountain62.jpg', 'FreeFoto_mountain_1_10.jpg', 'FreeFoto_mountain_4_8.jpg', 'land16.jpg', 'FreeFoto_mountain_4_28.jpg', 'cdmc181.jpg', 'FreeFoto_mountain_4_21.jpg', 'FreeFoto_mountain_4_18.jpg', 'land680.jpg', 'FreeFoto_mountain_1_44.jpg', 'mountain86.jpg', 'FreeFoto_mountain_4_45.jpg', 'mountain77.jpg', 'land18.jpg', 'land387.jpg', 'mountain06.jpg', 'CMP0003645_P.jpg', 'BXP0029825_P.jpg', 'land145.jpg', 'land143.jpg', 'mountain08.jpg', 'DVP4969295_P.jpg', 'mountain59.jpg', 'DVP4967994_P.jpg', 'mountain_03_02_askl.jpg', 'FreeFoto_mountain_1_15.jpg', 'mountain64.jpg', 'mountain93.jpg', 'mountain94.jpg', 'FreeFoto_mountain_4_47.jpg', 'FreeFoto_mountain_6_42.jpg', 'land188.jpg', 'land130.jpg', 'mountain76.jpg', 'mountain52.jpg', 'FreeFoto_mountain_1_2.jpg', 'FreeFoto_mountain_3_34.jpg', 'mountain50.jpg', 'FreeFoto_mountain_4_36.jpg', 'land179.jpg', 'mountain09.jpg', 'FreeFoto_mountain_1_5.jpg', 'mountain80.jpg', 'mountain54.jpg', 'FreeFoto_mountain_1_19.jpg', 'land210.jpg', 'FreeFoto_mountain_7_1.jpg', 'FreeFoto_mountain_3_29.jpg', 'FreeFoto_mountain_8_5.jpg', 'FreeFoto_mountain_1_36.jpg', 'FAN2009894_P.jpg', 'crique_13_08_google.jpg', 'land161.jpg', 'n44002.jpg', 'mountain19.jpg', 'land165.jpg', 'land132.jpg',
    ]
  }
};
const raw_sound_files = [
  'hu.wav', 'ri.wav', 'go.wav', 'ta.wav', 'no.wav', 'zu.wav', 'wa.wav', 'ku.wav', 'mu.wav', 'na.wav', 'zi.wav', 'do.wav', 'ze.wav', 'pe.wav', 'za.wav', 'pu.wav', 'se.wav', 'ko.wav', 'ga.wav', 'zo.wav', 'gu.wav', 'me.wav', 'po.wav', 'te.wav', 'bi.wav', 're.wav', 'ya.wav', 'ba.wav', 'da.wav', 'ra.wav', 'mo.wav', 'bo.wav', 'so.wav', 'ha.wav', 'hi.wav', 'si.wav', 'ru.wav', 'sa.wav', 'nu.wav', 'ke.wav', 'mi.wav', 'gi.wav', 'su.wav', 'de.wav', 'ro.wav', 'to.wav', 'bu.wav', 'ma.wav', 'pa.wav', 'ki.wav', 'ti.wav', 'pi.wav', 'yu.wav', 'ho.wav', 'he.wav', 'ni.wav', 'be.wav', 'tu.wav',
];

// --- ファイルパスの自動生成 ---
const image_files = { indoor: {}, outdoor: {} };
for (const main_cat_key in raw_image_files) {
  const main_cat_lower = main_cat_key.toLowerCase();
  image_files[main_cat_lower] = {};
  for (const sub_cat_key in raw_image_files[main_cat_key]) {
    const path_prefix = `scenes/${main_cat_key}/${sub_cat_key}/`;
    image_files[main_cat_lower][sub_cat_key] = raw_image_files[main_cat_key][sub_cat_key].map(filename => path_prefix + filename);
  }
}
const all_sounds = raw_sound_files.map(filename => `sounds/${filename}`);

// =========================================================================
// 刺激生成ロジック
// =========================================================================

// --- 音声刺激の準備 ---
const NUM_AB_PAIRS = 4;
const NUM_X_TRIALS = 4;
let shuffled_sounds = jsPsych.randomization.shuffle(all_sounds);
const sounds_for_A = shuffled_sounds.slice(0, NUM_AB_PAIRS);
const sounds_for_B = shuffled_sounds.slice(NUM_AB_PAIRS, NUM_AB_PAIRS * 2);
const sounds_for_X = shuffled_sounds.slice(NUM_AB_PAIRS * 2, NUM_AB_PAIRS * 2 + NUM_X_TRIALS);
const learned_sound_pairs = [];
for (let i = 0; i < NUM_AB_PAIRS; i++) {
  learned_sound_pairs.push([sounds_for_A[i], sounds_for_B[i]]);
}

// --- 学習フェーズの刺激を生成 (120試行) ---
const NUM_IMAGES_PER_CATEGORY = 12;
let learning_images = [];
for (const main_cat in image_files) {
    for (const sub_cat in image_files[main_cat]) {
        const sampled_images = jsPsych.randomization.sampleWithoutReplacement(image_files[main_cat][sub_cat], NUM_IMAGES_PER_CATEGORY);
        learning_images.push(...sampled_images);
    }
}
learning_images = jsPsych.randomization.shuffle(learning_images);

let base_trial_blocks = [];
for (let i = 0; i < NUM_AB_PAIRS; i++) {
  base_trial_blocks.push({ type: 'AB_PAIR', sound_A: sounds_for_A[i], sound_B: sounds_for_B[i] });
}
for (let i = 0; i < NUM_X_TRIALS; i++) {
  base_trial_blocks.push({ type: 'X_TRIAL', sound_X: sounds_for_X[i] });
}

let repeated_blocks = [];
for(let i = 0; i < 10; i++){
    repeated_blocks.push(...base_trial_blocks);
}
let shuffled_blocks = jsPsych.randomization.shuffle(repeated_blocks);

let image_counter = 0;
const learning_stimuli = [];
shuffled_blocks.forEach(block => {
  if (block.type === 'AB_PAIR') {
    learning_stimuli.push({ image: learning_images[image_counter++], sound: block.sound_A, sound_pattern: 'パターンA' });
    learning_stimuli.push({ image: learning_images[image_counter++], sound: block.sound_B, sound_pattern: 'パターンB' });
  } else {
    learning_stimuli.push({ image: learning_images[image_counter++], sound: block.sound_X, sound_pattern: 'パターンX' });
  }
});

// --- テストフェーズの刺激を生成 ---
const all_image_paths_flat = Object.values(image_files.indoor).concat(Object.values(image_files.outdoor)).flat();
const unused_images = all_image_paths_flat.filter(img => !learning_images.includes(img));
const new_images_for_test = jsPsych.randomization.sampleWithoutReplacement(unused_images, learning_images.length);
const image_recognition_stimuli = [
  ...learning_images.map(img => ({ image: img, status: 'old', correct_response: 'j' })),
  ...new_images_for_test.map(img => ({ image: img, status: 'new', correct_response: 'k' }))
];
const TOTAL_SOUNDS_USED = (NUM_AB_PAIRS * 2) + NUM_X_TRIALS;
const unused_sounds_for_test = shuffled_sounds.slice(TOTAL_SOUNDS_USED);
const new_sound_pairs = [];
for (let i = 0; i < NUM_AB_PAIRS; i++) {
  new_sound_pairs.push([unused_sounds_for_test[i*2], unused_sounds_for_test[i*2 + 1]]);
}
const sound_2afc_stimuli = [];
const shuffled_old_pairs = jsPsych.randomization.shuffle(learned_sound_pairs);
const shuffled_new_pairs = jsPsych.randomization.shuffle(new_sound_pairs);
for (let i = 0; i < NUM_AB_PAIRS; i++) {
  const presentation_order = jsPsych.randomization.shuffle(['old', 'new']);
  sound_2afc_stimuli.push({
    old_pair: shuffled_old_pairs[i],
    new_pair: shuffled_new_pairs[i],
    presentation_order: presentation_order,
    correct_response: presentation_order[0] === 'old' ? 'j' : 'k'
  });
}

// -------------------- タイムラインの構築 --------------------
const all_image_paths_for_preload = learning_images.concat(new_images_for_test);
const all_sound_paths_for_preload = shuffled_sounds;
const preload_trial = {
  type: jsPsychPreload,
  images: all_image_paths_for_preload,
  audio: all_sound_paths_for_preload,
  message: '実験の準備をしています。しばらくお待ちください...'
};
timeline.push(preload_trial);

const learning_procedure = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {
    return `
      <div style="width: 800px; min-height: 500px; display: flex; align-items: center; justify-content: center;">
        <img id="learning_image" src="${jsPsych.timelineVariable('image')}" style="max-width: 100%; max-height: 500px; height: auto;">
      </div>`;
  },
  choices: ['j', 'k'],
  prompt: '<p style="font-size: 1.2em;"><b>J</b> = 屋内 / <b>K</b> = 屋外</p>',
  data: {
    image_filename: jsPsych.timelineVariable('image'),
    sound_pattern: jsPsych.timelineVariable('sound_pattern'),
    task_phase: 'learning'
  },
  on_start: function(trial) {
    const sound_path = jsPsych.timelineVariable('sound');
    const audio = new Audio(sound_path);
    audio.addEventListener('ended', () => {
      const img_element = document.getElementById('learning_image');
      if (img_element) {
        img_element.style.visibility = 'hidden';
      }
    });
    audio.play();
  }
};

const learning_stimuli_part1 = learning_stimuli.slice(0, 60);
const learning_stimuli_part2 = learning_stimuli.slice(60);

const learning_block_1 = {
  timeline: [learning_procedure],
  timeline_variables: learning_stimuli_part1,
  randomize_order: false
};
const learning_block_2 = {
    timeline: [learning_procedure],
    timeline_variables: learning_stimuli_part2,
    randomize_order: false
};
timeline.push(learning_block_1);
timeline.push(break_trial);
timeline.push(learning_block_2);
timeline.push(instructions_test_start);

const image_recognition_procedure = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {
    const image_path = jsPsych.timelineVariable('image');
    return `<div style="width: 800px; min-height: 500px; display: flex; align-items: center; justify-content: center;">
              <img src="${image_path}" style="max-width: 100%; max-height: 500px; height: auto;">
            </div>`;
  },
  choices: ['j', 'k'],
  prompt: `
    <p>この画像は、先ほどの学習フェーズで見ましたか？</p>
    <p style="font-size: 1.2em;"><b>J</b> = はい、見ました / <b>K</b> = いいえ、見ていません</p>`,
  data: {
    image_filename: jsPsych.timelineVariable('image'),
    correct_response: jsPsych.timelineVariable('correct_response'),
    task_phase: 'image_recognition'
  },
  on_finish: function(data) {
    data.correct = data.response === data.correct_response;
  }
};
const image_recognition_block = {
  timeline: [image_recognition_procedure],
  timeline_variables: image_recognition_stimuli,
  randomize_order: true
};
timeline.push(image_recognition_block);

const instructions_sound_2afc = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p><strong>【音声ペアテスト】</strong></p>
        <p>準備ができたら、何かキーを押して開始してください。</p>
    `,
    post_trial_gap: 500
};
timeline.push(instructions_sound_2afc);

const sound_2afc_playback_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<p style="font-size: 1.5em;">再生準備中...</p>',
    choices: "NO_KEYS",
    trial_duration: 500,
    on_finish: function() {
        const old_pair = jsPsych.timelineVariable('old_pair', true);
        const new_pair = jsPsych.timelineVariable('new_pair', true);
        const presentation_order = jsPsych.timelineVariable('presentation_order', true);

        const first_pair_sounds = presentation_order[0] === 'old' ? old_pair : new_pair;
        const second_pair_sounds = presentation_order[1] === 'old' ? old_pair : new_pair;

        const audio1 = new Audio(first_pair_sounds[0]);
        const audio2 = new Audio(first_pair_sounds[1]);
        const audio3 = new Audio(second_pair_sounds[0]);
        const audio4 = new Audio(second_pair_sounds[1]);
        
        const display_element = jsPsych.getDisplayElement();
        const stimulus_div = display_element.querySelector('#jspsych-html-keyboard-response-stimulus');

        const play_second_pair = () => {
            if(stimulus_div) stimulus_div.innerHTML = '<p style="font-size: 1.5em;">2組目...</p>';
            setTimeout(() => { audio3.play(); }, 700);
        };

        audio1.addEventListener('ended', () => setTimeout(() => audio2.play(), 100));
        audio2.addEventListener('ended', play_second_pair);
        audio3.addEventListener('ended', () => setTimeout(() => audio4.play(), 100));
        
        if(stimulus_div) stimulus_div.innerHTML = '<p style="font-size: 1.5em;">1組目...</p>';
        audio1.play();
    }
};
const sound_2afc_response_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>どちらのペアが学習フェーズで聞いたペアでしたか？</p>
    `,
    choices: ['j', 'k'],
    prompt: `<p style="font-size: 1.2em;"><b>J</b> = 1組目 / <b>K</b> = 2組目</p>`,
    data: {
        old_pair: jsPsych.timelineVariable('old_pair'),
        new_pair: jsPsych.timelineVariable('new_pair'),
        presentation_order: jsPsych.timelineVariable('presentation_order'),
        correct_response: jsPsych.timelineVariable('correct_response'),
        task_phase: 'sound_recognition'
    },
    on_finish: function(data) {
        data.correct = data.response === data.correct_response;
    }
};
const sound_recognition_block = {
  timeline: [sound_2afc_playback_trial, sound_2afc_response_trial],
  timeline_variables: sound_2afc_stimuli
};
timeline.push(sound_recognition_block);

// --- 実験の実行 ---
jsPsych.run(timeline);