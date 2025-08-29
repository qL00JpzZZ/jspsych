// jsPsychの初期化と実験タイムラインの定義
const jsPsych = initJsPsych();

const all_trials = [];

// カテゴリごとの画像ファイルパスのリストを定義
const categories = {
  INDOOR: {
    grocerystore: [
      '08082003_aisle.jpg', 'Picture_22.jpg', 'supermarche3-1.jpg', 'duroseshopDM1710_468x527.jpg', 'shop17.jpg',
      'kays-1.jpg', 'int89.jpg', '22184680.jpg', 'APRIL242002FakeGroceryStore.jpg', 'supermarket.jpg',
      'shop13.jpg', 'shop16.jpg', '1798025006_f8c475b3fd.jpg', 'Inside the supermarket.jpg', 'shop18.jpg',
      '44l.jpg', 'cbra3.jpg', 'MainFoodStoreProduce1.jpg', 'supermarche33-1.jpg', 'integral-color4_detail.jpg',
      'grocery.jpg', 'grocery-store-740716-1.jpg', 'ahpf.supermarche4.jpg', 'supermarket66.jpg', 'coffee_sold_supermarket_1.jpg',
      'shop30.jpg', 'super_market.jpg', 'shop14.jpg', 'int131.jpg', 'int576.jpg',
      'room250.jpg', 'int606.jpg', 'int867.jpg', 'int112.jpg', 'int867.jpg',
    ],
    library: [
      'library_journals_books.jpg', 'Bibliotheque6.jpg', 'library2.jpg', '763634302_e25f44402d.jpg', 'Library Pictures.jpg',
      'Library_P2150016.jpg', 'danielkimberlylibrarycl1.jpg', 'howland.jpg', 'JPB_Library.jpg', '57048683_74701f9fa9.jpg',
      'library4.jpg', '43407107_204b8504b5.jpg', 'meura1.jpg', 'biblio01.jpg', 'Dsc00613-3.jpg',
      'library bookshelves large.jpg', 'bookstore_more_books.jpg', 'Library Pictures (3).jpg', 'BM_Frejus Bibliotheque 1.jpg', '34_AvH_014_library_stacks.jpg',
      'association_bibliotheque.jpg', 'ins19.jpg', 'Day100006web.jpg', 'Fairfield_Pub_Library_A.jpg', 'image bibliotheque.jpg',
      'ccls-img-buildingbos.jpg', 'New York Public Library5.jpg', 'bibliotheque55.jpg', 'Homework2.jpg', 'ins18.jpg',
      'Library98.jpg', 'library466.jpg', '28-06-06 Biblioth_que Municipale (19).jpg', 'library05.jpg', 'bibliotheque_photo.jpg',
      'la_bibliotheque_de_la_tour_du_valat.jpg', 'ins21.jpg', 'DSC02518.jpg', 'library02.jpg', 'fibiba1.jpg',
      'bibliotheque_0908.jpg', '130309783_f194f43f71.jpg', 'image_preview.jpg', 'librairie-16.jpg', 'library04.jpg',
      'inside01.jpg', 'library01.jpg', 'neilson-hays-library02.jpg', 'gallerie-1130426509812-81.80.90.133.jpg', 'int91.jpg',
      'library03.jpg', '473767793_d3cafc4eff.jpg', 'mainLibrary.jpg', 'librairie.jpg', 'Bibliotheque_01.jpg',
      '470618728_18b5550006.jpg', '207157437_14c21369e9.jpg', 'fine_arts.jpg', 'inside01.jpg', 'library5.jpg',
      'Dsc00613-3.jpg', 'library bookshelves large.jpg', 'library_journals_books.jpg', 'neilson-hays-library02.jpg', 'library01.jpg',
      'Concord_Free_Public_Library_Renovation_122.jpg', 'Library Pictures.jpg', '130309783_f194f43f71.jpg', 'library466.jpg', '473767793_d3cafc4eff.jpg',
      'int91.jpg', 'meura1.jpg', 'danielkimberlylibrarycl1.jpg',
    ],
    restaurant: [
      'int112.jpg', 'restau79c.l.jpg', 'Restau52C.L.jpg', 'INT236.jpg', '2006_11_tastingroom.jpg',
      'int576.jpg', 'N190059.jpg', 'room251.jpg', 'int803.jpg', 'OriginalSteakhouse.jpg',
      'gaststaette1.jpg', 'int863.jpg', 'room230.jpg', 'olis.small.jpg', 'N190036.jpg',
      'room172.jpg', 'restau.14.jpg', 'food2_450.jpg', 'restau.17.jpg', 'int862.jpg',
      'int579.jpg', 'gaststaette15.jpg', 'Gaststatte_kl.jpg', 'restau.15.jpg', 'room149.jpg',
      'food4_450.jpg', 'restau.04.jpg', 'room171.jpg', 'restau.02.jpg', 'int578.jpg',
      'gaststaette5.jpg', 'Bertucci_01_lg.jpg', 'Restau33C.L.jpg', 'int608.jpg', 'room143.jpg',
      'RestauC.L.jpg', 'int603.jpg', '19165-298-298-1-0.jpg', 'restau.18.jpg', 'room252.jpg',
      'Kulturhaus_kneipe.jpg', 'mortonsdr.jpg', 'int607.jpg', 'int604.jpg', 'room176.jpg',
      'int577.jpg', 'int90.jpg', 'restau.01.jpg', 'int783.jpg', 'int606.jpg',
      'int60.jpg', 'restau.08.jpg', 'restau.12.jpg', 'room106.jpg', 'restau.19.jpg',
      'cbra3.jpg', 'restau30C.L.jpg',
    ],
    kitchen: [
      'cdmc1170.jpg', 'dining047.jpg', 'cdmc1123.jpg', 'cdmc1178.jpg', 'cdmc1144.jpg',
      'k4.jpg', 'int362.jpg', 'int34.jpg', 'kitchen083.jpg', 'cdmc1120.jpg',
      'int35.jpg', 'int423.jpg', 'iclock.jpg', 'k11.jpg', 'kitchen003.jpg',
      'cdmc1145.jpg', 'cdmc1289.jpg', 'cdMC1148.jpg', 'cdmc1143.jpg', 'cdmc1126.jpg',
      'kitchen031.jpg', 'int360.jpg', 'int166.jpg', 'int437.jpg', 'cdmc1151.jpg',
      'k2.jpg', 'kitchen5.jpg', 'cdmc1128.jpg', 'kitchen077.jpg', 'int474.jpg',
      'cdmc1172.jpg', 'cdmc1146.jpg', 'int422.jpg', 'cdMC1154.jpg', 'int347.jpg',
      'cdmc1299.jpg', 'kitchen081.jpg', 'k9.jpg', 'k6.jpg', 'k8.jpg',
      'cdmc1119.jpg', 'cdmc1167.jpg', 'aa014484.jpg', 'kitchen004.jpg', 'k3.jpg',
      'kitchen086.jpg', 'int365.jpg', 'cdmc1164.jpg', 'kitchen032.jpg', 'k5.jpg',
      'int357.jpg', 'k7.jpg', 'k12.jpg', 'k1.jpg', 'k10.jpg',
      'cdmc1175.jpg', 'int396.jpg', 'cdmc1194.jpg', 'kitchen054.jpg', 'aa041720.jpg',
    ],
    gym: [
      'csu6.jpg', 'gym13.jpg', 'bg-gym2.jpg', 'SALLE3.jpg', 'room399.jpg',
      'gym09.jpg', 'fitness_center3.jpg', 'Image_Grande72.jpg', 'salle-cardio-grand.jpg', 'herade_inside.jpg',
      'salle_1.jpg', 'ucc_gym_photos_bg.jpg', 'montreal_octo 030.jpg', 'fieldhouse-weightroom.jpg', 'gym_b4.jpg',
      'guyane_muscul.jpg', 'Gym-Equipment.jpg', 'gym04.jpg', 'gym03.jpg', 'MSAC_Gym_-_20061515.jpg',
      'room424.jpg', 'salle_9.jpg', 'gym06.jpg', 'int838.jpg', 'Gym432.jpg',
      'gym_b.jpg', 'url.jpg', 'gym65.jpg', 'saledemuscu11.jpg', 'int525.jpg',
      'uploads-images-photos_images-fullsize-gym.jpg', 'hotel-megeve-11.jpg', 'Gym05.jpg', 'Proflex gym lagos nigeria 4.jpg', 'junglegym-60.jpg',
      'Photo-008.jpg', 'media40037.jpg', 'gym07.jpg', 'gym3.jpg', 'refurbished-gym-equipment.jpg',
      'southglade_gym-2.jpg', 'HO-00-01-5186-23_l.jpg', 'necker_salle_de_gym_reference.jpg', 'Gym2_000.jpg', 'web-cardio-theatre-gym.jpg',
      'biosite-gym.jpg', 'p1a.jpg', 'media39989.jpg', 'SalleMuscu.jpg', 'gym_left.jpg',
      'gym45.jpg', 'gym08.jpg', 'gym14.jpg', 'gym2.jpg', 'room398.jpg',
      'HO-00-02-5304-28A_l.jpg', 'GymInt1.jpg', 'gym001.jpg'
    ]
  },
  OUTDOOR: {
    castle: [
      'chateau_v.jpg', 'FreeFoto_castle_1_40.jpg', 'chateau-chillon-1.jpg', 'chenonceaux-chateau-de-chenonceau-chenony1-1.jpg', 'FreeFoto_castle_17_48.jpg',
      'FreeFoto_castle_1_13.jpg', 'chateau_frontenac.jpg', 'chateau_barrail1.jpg', '087  Chateau Laurier.jpg', '38588-Chateau-De-Cruix-0.jpg',
      'FreeFoto_castle_1_29.jpg', 'FreeFoto_castle_3_9.jpg', 'FreeFoto_castle_5_49.jpg', 'FreeFoto_castle_14_31.jpg', 'build155.jpg',
      'FreeFoto_castle_16_21.jpg', 'FreeFoto_castle_1_9.jpg', 'FreeFoto_castle_16_1.jpg', 'FreeFoto_castle_8_2.jpg', 'FreeFoto_castle_1_25.jpg',
      'FreeFoto_castle_1_3.jpg', 'FreeFoto_castle_17_2.jpg', 'FreeFoto_castle_9_36.jpg', 'FreeFoto_castle_16_48.jpg', 'FreeFoto_castle_14_34.jpg',
      'Chateau 1-1.jpg', 'FreeFoto_castle_16_1.jpg', 'FreeFoto_castle_1_10.jpg', 'FreeFoto_castle_17_39.jpg', 'FreeFoto_castle_1_40.jpg',
      'FreeFoto_castle_1_15.jpg', 'build155.jpg', 'FreeFoto_castle_1_5.jpg', 'FreeFoto_castle_1_36.jpg', 'FreeFoto_castle_5_41.jpg',
      'FreeFoto_castle_22_40.jpg', 'FreeFoto_castle_1_32.jpg', 'build124.jpg', 'FreeFoto_castle_8_10.jpg', 'FreeFoto_castle_15_11.jpg',
      'chateau-chillon-1.jpg', 'chateau_frontenac.jpg', 'FreeFoto_castle_1_17.jpg', 'FreeFoto_castle_1_1.jpg', 'FreeFoto_castle_1_9.jpg',
      'chateau-de-losse.jpg', 'FreeFoto_castle_1_21.jpg', 'FreeFoto_castle_16_14.jpg', 'FreeFoto_castle_8_37.jpg', 'FreeFoto_castle_8_2.jpg',
      'build124.jpg', 'FreeFoto_castle_1_17.jpg', 'arques_chateau_3.jpg', '7_12_chateau_de_chauvac-1.jpg', 'carcassonebridge.jpg',
      'FreeFoto_castle_5_49.jpg', 'FreeFoto_castle_1_26.jpg', 'FreeFoto_castle_1_38.jpg', 'FreeFoto_castle_1_32.jpg', 'FreeFoto_castle_16_48.jpg',
      'FreeFoto_castle_1_26.jpg', 'chateau-de-losse.jpg', 'arques_chateau_3.jpg', 'FreeFoto_castle_1_21.jpg', 'FreeFoto_castle_8_29.jpg',
      'FreeFoto_castle_17_2.jpg', 'FreeFoto_castle_20_49.jpg', 'FreeFoto_castle_3_9.jpg', 'FreeFoto_castle_1_5.jpg', 'chenonceaux-chateau-de-chenonceau-chenony1-1.jpg',
      'FreeFoto_castle_8_37.jpg', 'FreeFoto_castle_1_10.jpg', 'FreeFoto_castle_8_29.jpg', 'Chateau D\'Usse.jpg', 'Chateau 1-1.jpg',
      'FreeFoto_castle_16_49.jpg', 'FreeFoto_castle_9_36.jpg', 'FreeFoto_castle_8_7.jpg', 'FreeFoto_castle_15_11.jpg', 'FreeFoto_castle_8_10.jpg',
      'FreeFoto_castle_1_24.jpg', 'FreeFoto_castle_1_12.jpg', 'FreeFoto_castle_8_7.jpg', 'FreeFoto_castle_14_34.jpg', 'chateau_barrail1.jpg',
      'FreeFoto_castle_1_22.jpg', 'FreeFoto_castle_22_40.jpg', 'Chateau D\'Usse.jpg', 'FreeFoto_castle_5_41.jpg', 'FreeFoto_castle_16_7.jpg',
      'FreeFoto_castle_3_27.jpg', 'FreeFoto_castle_17_39.jpg', 'FreeFoto_castle_1_24.jpg', 'FreeFoto_castle_1_15.jpg', '087  Chateau Laurier.jpg',
      'FreeFoto_castle_1_1.jpg', 'FreeFoto_castle_16_21.jpg', 'FreeFoto_castle_20_49.jpg', 'FreeFoto_castle_16_14.jpg', 'FreeFoto_castle_1_12.jpg',
      'FreeFoto_castle_1_13.jpg', 'build680.jpg', 'carcassonebridge.jpg', '38588-Chateau-De-Cruix-0.jpg', '7_12_chateau_de_chauvac-1.jpg',
      'FreeFoto_castle_14_31.jpg', 'build680.jpg', 'chateau_de_bran_chateau_de_dracula.jpg', 'FreeFoto_castle_16_7.jpg', 'FreeFoto_castle_1_3.jpg',
      'chateau_de_bran_chateau_de_dracula.jpg', 'FreeFoto_castle_1_36.jpg', 'FreeFoto_castle_1_29.jpg', 'FreeFoto_castle_1_25.jpg', 'FreeFoto_castle_1_38.jpg',
      'chateau_v.jpg', 'FreeFoto_castle_3_27.jpg', 'FreeFoto_castle_16_49.jpg', 'FreeFoto_castle_1_22.jpg'
    ],
    beach: [
      'beach_167_08_flickr.jpg', 'beach_127_15_flickr.jpg', 'beach_163_18_flickr.jpg', 'CCP0013242_P.jpg', 'bea3.jpg',
      'beach_35_16_altavista.jpg', 'beach_01_05_google.jpg', 'beach_95_03_flickr.jpg', 'cdMC862.jpg', 'beach_01_02_google.jpg',
      'beach_dsc00550.jpg', 'CCP0013242_P.jpg', 'beach_167_15_flickr.jpg', 'beach_163_23_flickr.jpg', 'beach_39_09_flickr.jpg',
      'bea10.jpg', 'beach_01_05_google.jpg', 'beach_121_12_flickr.jpg', 'bea2.jpg', 'beach_28_18_flickr.jpg',
      'beach_55_21_flickr.jpg', 'beach_47_02_altavista.jpg', 'bea2.jpg', 'beach_13_11_flickr.jpg', 'bambouseraie_45_05_google.jpg',
      'beach_01_08_google.jpg', 'beach_04_06_ask.jpg', 'beach_161_11_flickr.jpg', 'beach_08_07_google.jpg', 'beach_11_02_ask.jpg',
      '1147453287.jpg', 'beach_01_12_flickr.jpg', 'beach_30_16_flickr.jpg', 'beach_08_07_google.jpg', 'beach_01_08_google.jpg',
      'beach_35_16_altavista.jpg', 'beach_18_22_flickr.jpg', 'beach_04_06_ask.jpg', 'beach_02_06_ask.jpg', 'beach_91_17_flickr.jpg',
      'beach_26_07_flickr.jpg', 'CCP0013911_P.jpg', 'beach_55_21_flickr.jpg', 'Cancun.jpg', 'beach_127_15_flickr.jpg',
      'CCP0012536_P.jpg', 'beach_143_14_flickr.jpg', 'beach_163_23_flickr.jpg', 'beach_144_05_flickr.jpg', 'beach_01_03_altavista.jpg',
      'beach_39_09_flickr.jpg', 'beach_166_09_flickr.jpg', 'beach.jpg', 'beach_45_01_altavista.jpg', 'AYP0779018_P.jpg',
      'beach_95_03_flickr.jpg', 'bea10.jpg', '2006-02-13-15-28-07sml.jpg', 'beach_13_11_flickr.jpg', 'beach_163_18_flickr.jpg',
      'beach_37_22_flickr.jpg', 'beach_08_04_ask.jpg', 'beach_47_02_altavista.jpg', 'beach_167_15_flickr.jpg', 'beach_dsc00550.jpg',
      'AYP0779641_P.jpg', 'beach_30_16_flickr.jpg', '1147453287.jpg', 'bea4.jpg', 'beach_45_01_altavista.jpg',
      'beach_121_12_flickr.jpg', 'beach_08_04_ask.jpg', 'CCP0012536_P.jpg', 'DVP1915541_P.jpg', 'beach_18_22_flickr.jpg',
      'beach_51_15_altavista.jpg', 'beach_01_01_ask.jpg', 'beach_51_15_altavista.jpg', 'AYP0779018_P.jpg', 'bea4.jpg',
      'beach_144_05_flickr.jpg', 'beach_28_18_flickr.jpg', 'beach_04_11_google.jpg', 'beach_166_09_flickr.jpg', 'beach_01_03_altavista.jpg',
      'beach_167_08_flickr.jpg', 'beach_19_07_altavista.jpg', 'beach_02_06_ask.jpg', 'beach_143_14_flickr.jpg', 'cdMC862.jpg',
      'beach_34_12_flickr.jpg', 'bea5.jpg', 'beach_01_05_askl.jpg', 'AYP0779641_P.jpg', 'beach_26_07_flickr.jpg',
      'beach_01_12_flickr.jpg', 'Cancun.jpg', 'beach_37_22_flickr.jpg', 'beach_19_07_altavista.jpg', 'beach_34_12_flickr.jpg',
      'cdMC839.jpg', 'BLP0018661_P.jpg', 'beach_04_11_google.jpg', 'beach_01_05_askl.jpg', 'bea3.jpg',
      'BLP0018661_P.jpg', '2006-02-13-15-28-07sml.jpg', 'bambouseraie_45_05_google.jpg', 'CCP0013911_P.jpg', 'beach_01_02_google.jpg',
      'bea5.jpg', 'beach_01_01_ask.jpg', 'beach_161_11_flickr.jpg', 'beach_01_03_google.jpg', 'DVP1915541_P.jpg',
      'beach.jpg', 'beach_01_03_google.jpg', 'beach_91_17_flickr.jpg', 'cdMC839.jpg', 'beach_11_02_ask.jpg',
    ],
    forest: [
      'FreeFoto_forest_3_19.jpg', 'FAN1006576_P.jpg', 'CBP1014811_P.jpg', 'forest_01_01_ask.jpg', 'cdMC349.jpg',
      'forest24.jpg', 'forest25.jpg', 'FreeFoto_forest_9_7.jpg', 'AYP0783202_P-1.jpg', 'forest_11_20_yahoo.jpg',
      'DVP4907648_P.jpg', 'forest_02_11_altavista.jpg', 'forest_01_01_google.jpg', 'forest05.jpg', 'CYP0800679_P.jpg',
      'forest_09_05_askl.jpg', 'forest_11_06_askl.jpg', 'AGP0027965_P.jpg', 'DVP4967677_P.jpg', '36021.jpg',
      'FreeFoto_forest_3_44.jpg', 'AYP0783202_P-1.jpg', 'forest24.jpg', 'forest_31_02_altavista.jpg', 'CYP0801743_P.jpg',
      'cdMC413.jpg', 'CBP1014811_P.jpg', 'DVP4966497_P.jpg', 'DVP4962393_P.jpg', '08Trees.jpg',
      'CYP0800679_P.jpg', 'forest_18_04_askl.jpg', 'DVP4966497_P.jpg', 'forest_11_02_altavista.jpg', 'FreeFoto_forest_11_32.jpg',
      'FreeFoto_forest_3_44.jpg', 'forest_36_05_altavista.jpg', 'FreeFoto_forest_3_26.jpg', 'bambouseraie_12_10_altavista.jpg', 'FreeFoto_forest_3_19.jpg',
      'CCP0014018_P-1.jpg', 'forest_01_01_google.jpg', '08Trees.jpg', 'nat234.jpg', 'forest10.jpg',
      'forest20.jpg', 'forest_01_02_ask.jpg', 'FreeFoto_forest_3_32.jpg', 'forest05.jpg', 'forest_01_02_altavista.jpg',
      'forest_30_02_yahoo.jpg', 'CYP0801743_P.jpg', 'forest_31_02_altavista.jpg', 'forest_36_05_altavista.jpg', 'CCP0014018_P-1.jpg',
      'FreeFoto_forest_2_48.jpg', 'FreeFoto_national park_10_1.jpg', '36032.jpg', 'AYP0783229_P.jpg', 'FreeFoto_forest_3_32.jpg',
      'AGP0027965_P.jpg', 'forest20.jpg', 'forest_32_08_altavista.jpg', 'bambouseraie_12_10_altavista.jpg', 'cdMC398.jpg',
      'FreeFoto_forest_3_20.jpg', 'FreeFoto_forest_11_36.jpg', 'cdMC349.jpg', 'cdMC413.jpg', 'forest_11_20_yahoo.jpg',
      'FAN2016942_P.jpg', 'forest_17_01_askl.jpg', 'FreeFoto_forest_2_47.jpg', 'DVP4967677_P.jpg', '36021.jpg',
      'nat234.jpg', 'forest_05_06_askl.jpg', 'FreeFoto_forest_3_26.jpg', 'forest_17_01_askl.jpg', 'FAN1006576_P.jpg',
      'FreeFoto_forest_3_43.jpg', 'DVP4962393_P.jpg', '482063.jpg', 'cdMC617.jpg', 'DVP4907648_P.jpg',
      'bambouseraie_02_05_altavista.jpg', 'forest13.jpg', 'forest_14_16_yahoo.jpg', 'forest_18_04_askl.jpg', 'forest_14_16_yahoo.jpg',
      'FreeFoto_forest_3_43.jpg', 'forest_11_06_askl.jpg', 'FreeFoto_forest_2_48.jpg', 'forest13.jpg', 'nat408.jpg',
      'FreeFoto_forest_11_32.jpg', 'forest_32_08_altavista.jpg', 'FAN2016942_P.jpg', 'FreeFoto_national park_10_1.jpg', 'forest_02_11_altavista.jpg',
      '36032.jpg', 'FreeFoto_forest_11_36.jpg', 'forest10.jpg', 'bambouseraie_02_05_altavista.jpg', 'forest_09_05_askl.jpg',
      'forest_11_02_altavista.jpg', 'FreeFoto_forest_3_20.jpg', 'forest_30_02_yahoo.jpg', 'forest_01_02_ask.jpg', '482063.jpg',
      'forest_01_02_altavista.jpg', 'forest_01_01_ask.jpg', 'forest25.jpg', 'cdMC398.jpg', 'AYP0783229_P.jpg',
      'cdMC617.jpg', 'nat408.jpg', 'FreeFoto_forest_9_7.jpg', 'forest_05_06_askl.jpg', 'FreeFoto_forest_2_47.jpg',
    ],
    desert: [
      'des22.jpg', 'NA006526.jpg', 'Desert_de_Gobi.jpg', 'beach_138_10_flickr.jpg', 'des14.jpg',
      'AA019096.jpg', 'land616.jpg', 'NA004783.jpg', 'land701.jpg', 'bambouseraie_42_12_google.jpg',
      'land514.jpg', 'NA001302.jpg', 'NA008867.jpg', 'beach_165_20_flickr.jpg', 'des15.jpg',
      'NA006122.jpg', 'beach_40_21_flickr.jpg', 'MWP0020668_P.jpg', '611sahara.jpg', 'des13.jpg',
      'beach_02_10_yahoo.jpg', 'beach_115_11_flickr.jpg', 'NA000915.jpg', 'NA006122.jpg', 'NA004090.jpg',
      'AA005954.jpg', 'cdmc795.jpg', 'beach_34_01_flickr.jpg', 'G02 Gobi Desert Sand Dunes.jpg', 'forest_34_08_altavista.jpg',
      'des17.jpg', 'beach_26_19_altavista.jpg', 'BXP0035856_P.jpg', 'des18.jpg', 'land564.jpg',
      'AA005954.jpg', '800px-Towering_Sand_Dunes.jpg', 'bambouseraie_42_12_google.jpg', '255055.jpg', 'AIP0005723_P.jpg',
      'NA006111.jpg', '034medanos.jpg', 'NA000915.jpg', 'land526.jpg', '800px-Towering_Sand_Dunes.jpg',
      'DVP4967429_P.jpg', 'NA006361.jpg', 'cdmc795.jpg', 'land656.jpg', 'BXP0035855_P.jpg',
      '50092.jpg', 'Desert_de_Gobi.jpg', 'land645.jpg', 'beach_02_10_yahoo.jpg', 'NA008867.jpg',
      'beach_91_12_flickr.jpg', 'AA019096.jpg', 'des14.jpg', '034medanos.jpg', 'NA007446.jpg',
      'natu539.jpg', 'mountain_10_04_askl.jpg', '480075.jpg', 'natu539.jpg', 'land656.jpg',
      'AA005940.jpg', 'beach_165_20_flickr.jpg', 'Lone Palm, Sahara Desert-1.jpg', 'AIP0005723_P.jpg', 'land526.jpg',
      'beach_138_10_flickr.jpg', 'DVP4967429_P.jpg', 'des22.jpg', 'natu89.jpg', 'beach_26_19_altavista.jpg',
      'Lone Palm, Sahara Desert-1.jpg', 'land658.jpg', '480075.jpg', 'land616.jpg', 'beach_91_12_flickr.jpg',
      'BXP0035856_P.jpg', 'AA020480.jpg', 'n251011.jpg', 'BXP0035855_P.jpg', 'n251011.jpg',
      'NA006526.jpg', 'beach_115_11_flickr.jpg', 'NA004783.jpg', 'land645.jpg', 'AA020480.jpg',
      'NA006361.jpg', 'natu89.jpg', 'land701.jpg', 'G02 Gobi Desert Sand Dunes.jpg', '611sahara.jpg',
      'beach_34_01_flickr.jpg', 'land657.jpg', 'NA001302.jpg', 'MWP0020668_P.jpg', 'des16.jpg',
      'mountain_10_04_askl.jpg', '50092.jpg', 'des18.jpg', '255055.jpg', 'land658.jpg',
      'des15.jpg', 'AA005940.jpg', 'land657.jpg', 'des16.jpg', 'forest_34_08_altavista.jpg',
      'NA006111.jpg', 'NA004090.jpg', 'des13.jpg', 'NA007446.jpg', 'des21.jpg',
      'beach_40_21_flickr.jpg', 'des21.jpg',
    ],
    mountain: [
      'FreeFoto_mountain_1_31.jpg', 'mountain05.jpg', 'mountain62.jpg', 'FreeFoto_mountain_1_10.jpg', 'FreeFoto_mountain_4_8.jpg',
      'land16.jpg', 'FreeFoto_mountain_4_28.jpg', 'cdmc181.jpg', 'FreeFoto_mountain_4_21.jpg', 'FreeFoto_mountain_4_28.jpg',
      'FreeFoto_mountain_4_18.jpg', 'land680.jpg', 'FreeFoto_mountain_1_44.jpg', 'mountain86.jpg', 'FreeFoto_mountain_4_45.jpg',
      'mountain77.jpg', 'land680.jpg', 'land18.jpg', 'land387.jpg', 'mountain06.jpg',
      'FreeFoto_mountain_4_45.jpg', 'CMP0003645_P.jpg', 'BXP0029825_P.jpg', 'land145.jpg', 'land143.jpg',
      'mountain08.jpg', 'FreeFoto_mountain_1_31.jpg', 'DVP4969295_P.jpg', 'mountain59.jpg', 'DVP4967994_P.jpg',
      'mountain_03_02_askl.jpg', 'FreeFoto_mountain_1_15.jpg', 'mountain64.jpg', 'mountain93.jpg', 'mountain94.jpg',
      'mountain08.jpg', 'mountain59.jpg', 'land143.jpg', 'FreeFoto_mountain_4_47.jpg', 'FreeFoto_mountain_6_42.jpg',
      'land188.jpg', 'land130.jpg', 'mountain76.jpg', 'mountain52.jpg', 'FreeFoto_mountain_1_2.jpg',
      'cdmc181.jpg', 'FreeFoto_mountain_3_34.jpg', 'FreeFoto_mountain_1_2.jpg', 'land387.jpg', 'mountain50.jpg',
      'FreeFoto_mountain_4_36.jpg', 'land179.jpg', 'mountain09.jpg', 'FreeFoto_mountain_1_5.jpg', 'mountain76.jpg',
      'mountain80.jpg', 'mountain54.jpg', 'mountain50.jpg', 'BXP0029825_P.jpg', 'FreeFoto_mountain_1_19.jpg',
      'mountain94.jpg', 'land210.jpg', 'FreeFoto_mountain_7_1.jpg', 'FreeFoto_mountain_3_29.jpg', 'FreeFoto_mountain_8_5.jpg',
      'FreeFoto_mountain_3_29.jpg', 'mountain64.jpg', 'FreeFoto_mountain_1_36.jpg', 'FreeFoto_mountain_1_5.jpg', 'FAN2009894_P.jpg',
      'land18.jpg', 'crique_13_08_google.jpg', 'FreeFoto_mountain_4_36.jpg', 'FreeFoto_mountain_1_15.jpg', 'land161.jpg',
      'mountain06.jpg', 'mountain_03_02_askl.jpg', 'FreeFoto_mountain_1_36.jpg', 'n44002.jpg', 'mountain19.jpg',
      'mountain19.jpg', 'mountain62.jpg', 'FreeFoto_mountain_4_18.jpg', 'FreeFoto_mountain_3_34.jpg', 'FreeFoto_mountain_4_47.jpg',
      'FreeFoto_mountain_4_8.jpg', 'land161.jpg', 'mountain52.jpg', 'FreeFoto_mountain_1_44.jpg', 'FreeFoto_mountain_8_5.jpg',
      'land16.jpg', 'mountain77.jpg', 'n44002.jpg', 'FreeFoto_mountain_1_37.jpg', 'mountain86.jpg',
      'FAN2009894_P.jpg', 'mountain09.jpg', 'FreeFoto_mountain_1_37.jpg', 'land210.jpg', 'crique_13_08_google.jpg',
      'FreeFoto_mountain_4_21.jpg', 'FreeFoto_mountain_1_10.jpg', 'land165.jpg', 'mountain80.jpg', 'FreeFoto_mountain_7_1.jpg',
      'land132.jpg', 'land165.jpg', 'land188.jpg', 'mountain54.jpg', 'CMP0003645_P.jpg',
      'land145.jpg', 'land130.jpg', 'mountain93.jpg', 'DVP4969295_P.jpg', 'land132.jpg',
      'DVP4967994_P.jpg', 'FreeFoto_mountain_6_42.jpg', 'land179.jpg', 'FreeFoto_mountain_1_19.jpg',
    ],
  }
};

// カテゴリごとに2つずつランダムに画像を選択
const selected_images = [];
for (const [parent_cat, sub_categories] of Object.entries(categories)) {
  for (const [sub_cat, images] of Object.entries(sub_categories)) {
    const shuffled_images = jsPsych.randomization.shuffle(images);
    for (let i = 0; i < 2; i++) {
      const selected_image = shuffled_images[i];
      const image_path = `scenes/${parent_cat}/${sub_cat}/${selected_image}`;
      selected_images.push(image_path);
    }
  }
}

// 選択した画像をシャッフル
const shuffled_selected_images = jsPsych.randomization.shuffle(selected_images);

// 各画像に対応する表示トライアルを作成
shuffled_selected_images.forEach(image_path => {
  const trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<img src="${image_path}" style="max-width:800px; max-height:600px;">`,
    choices: [' '], // スペースキーで次に進む
    on_finish: function(data) {
      // 画像のパスをデータに記録
      data.image_path = image_path;
    }
  };
  all_trials.push(trial);
});

// 実験の実行
jsPsych.run(all_trials);