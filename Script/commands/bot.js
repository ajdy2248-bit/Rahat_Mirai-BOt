const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "Obot",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰",
  description: "goibot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID, reason } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dhaka").format("HH:MM:ss L");
  var idgr = `${event.threadID}`;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = [
    "إذا زادت بوت سأغادر 😒😒",
    "لن أسمع 😼 لم تحب رئيسي (راهات) 🥺 يا فاشل 🥺",
    "أنا لا أتحدث مع الأغبياء، حسناً 😒",
    "لا تناديني كثيراً، سأقع في الحب 🙈",
    "قل لي يا حبيبي، هل تحبني؟ 🙈💋",
    "إذا ناديت كثيراً سأغضب 😑",
    "نعم قل 😒، ماذا يمكنني أن أفعل من أجلك 😐😑؟",
    "لماذا تنادي كثيراً؟ هل تريد الشتائم؟ 🤬",
    "أحبك يا جانو 🥰",
    "أهلاً قل لي كيف حالك 😚",
    "أنت لا تحترمني 😰😿",
    "توقف 😾 قل رئيس 😼",
    "اصمت وإلا سأكسر أسنانك",
    "إذا قلت بوت مرة أخرى سأقصه وأجعله صغيراً 🤭🤫",
    "لماذا يغادر البوت هكذا 😤🥺 ماذا حدث؟",
    "قل يا جانو 😘",
    "تزعجني كثيراً 😾، أنا مشغول مع جانو 😋",
    "يا أحمق لماذا تنادي كثيراً 🤬",
    "إذا ناديتني، سأعطيك قبلة 😘",
    "لا تناديني كثيراً، ليس لدي مزاج للمرح 😒",
    "أنا هنا مخفي، لا تزعجني 🙊🙁",
    "نعم يا جانو، تعال من هنا سأعطيك قبلة 🤭 😘",
    "ابتعد، ليس لديك عمل، فقط تدير بوت بوت 😉😋🤣",
    "لا أحد في بيتك يسمع كلامك، فهل سأسمع أنا؟ 🤔😂",
    "لا تناديني، أنا مشغول",
    "ماذا حدث؟ هل ارتكبت خطأً؟ 🤣",
    "قل ماذا ستقول، هل ستقوله أمام الجميع؟ 🤭🤏",
    "هل سنلتقي غداً؟ 😈",
    "نعم قل، أنا أستمع 😏",
    "كم مرة ستنادي؟ أنا أستمع",
    "همم قل ماذا ستفعل 😒",
    "حتى أثناء اللعب تناديني 😑🌚🔞",
    "قل ماذا يمكنني أن أفعل من أجلك",
    "أنا لا أرى أي شيء 👀 😎",
    "رئيس راهات يحبك 😌",
    "قل يا جانو 🌚",
    "ألا ترى أنني مشغول مع جانو 😒",
    "همم جانو، هناك مشكلة 😑😘",
    "أهلاً اسمع، جانو في كل مكان 😇😘",
    "ماذا ستفعل؟ 😒😬",
    "السلام عليكم، قل ماذا يمكنني أن أفعل من أجلك..! 🥰",
    "لا تناديني كثيراً، أعطه لصديقته 🙄",
    "لماذا تناديني كثيراً؟ 🤔 هل تحب أم لا؟ 🤭🙈",
    "🌻🌺💚 السلام عليكم ورحمة الله 💚🌺🌻",
    "أنا مشغول الآن مع رئيس راهات، لا تناديني 😕😏 شكرًا 🤝🌻",
    "لا تناديني، أعطه لصديقته 😽🫶🌺",
    "جانو 🥺 الآن قل للبوت فقط 😒 نسيت؟ 🙂❓",
    "أفف لم أفهم لماذا تنادي هكذا 😤😡😈",
    "جانو، ستعطي جدتك بيدي 🙊🙆‍♂",
    "اليوم مزاجي سيء، لا تناديني 😪🤧",
    "أحبك في الليل 🌺🤤💦",
    "انظر لصديقة راهات المستقبلية، لا أستطيع العثور عليها 😪🤧😭",
    "أريد أن أحلم بك، إذا أصبحت لي 💝🌺🌻",
    "جانو، ماذا ستفعل 🙊😝🌻",
    "إذا كنت فتاة، تعال مخفياً، أتعلم الحب من يوتيوب 🙊🙈😽",
    "لماذا تنادي كثيراً؟ 😒🙈🖤🌼",
    "محبتك كثيرة من رئيس راهات 🥰😽🫶، دعاء للجميع 💝",
    "إذا أردت أن تحب، اذهب لصندوق الرسائل 🥱🙊🌶️🍆",
    "لا تبالغ في الفخر 🌸 الموت مؤكد فقط الوقت غير مؤكد 🖤🙂",
    "بعض الناس لا يحبوني شيئًا فشيئًا 🙂😿🌸",
    "أنا أحبك 😽، كنت تفكر أنني سأقترح عليك 🥴، سأضرب كليتك 😒",
    "أنا طفل رضيع 😇🫵 أنت 🐸💦",
    "كم من الوقت مضى في الفراش 😿، أفتقدك 🥺🤧",
    "هل ستتزوج 👸؟ سأساعدك 😻🙈🥱",
    "هذه الفتاة 🙈😽 طعمها رائع 🥵💦",
    "إذا قال أحدهم 🙂، سأحتاجك فقط 💜🌸",
    "جميع الأشياء تُسرق 🙄، إلا قلب رئيس راهات 🥴😑😏",
    "أحبك كثيرًا 😽، سأقترح في الوقت المناسب 🔨😼",
    "لن أهتم بأحد بعد اليوم 😏، سأشتري كريم لتبييض بشرتي 🙂🐸"
  ];

  var rand = tl[Math.floor(Math.random() * tl.length)];

  if ((event.body.toLowerCase() == "MISS YOU") || (event.body.toLowerCase() == "miss you")) {
    return api.sendMessage("<أفتقدك الليلة 🥹🤖👅/👅-✘ 🎀 🍒:))", threadID);
  };

  if ((event.body.toLowerCase() == "") || (event.body.toLowerCase() == "")) {
    return api.sendMessage("", threadID);
  };
   
  if ((event.body.toLowerCase() == "..........") || (event.body.toLowerCase() == "")) {
    return api.sendMessage("اكتب !help", threadID);
  };
  
  if ((event.body.toLowerCase() == "sim") || (event.body.toLowerCase() == "simsimi")) {
    return api.sendMessage("اكتب أمر simsimi يا حبيبي", threadID);
  };
  
  if ((event.body.toLowerCase() == "ওই কিরে") || (event.body.toLowerCase() == "oi keray") ||(event.body.toLowerCase() == "...") || (event.body.toLowerCase() == "...")) {
    return api.sendMessage("حلو حلو 🍆⛏️🐸🤣", threadID);
  };

  if ((event.body.toLowerCase() == "bc") || (event.body.toLowerCase() == "mc")) {
    return api.sendMessage("نفس الشيء لك 😊", threadID);
  };

  if ((event.body.toLowerCase() == "🫦") || (event.body.toLowerCase() == "💋")) {
    return api.sendMessage("ماذا! هذه رموز تعبيرية؟", threadID);
  };

  if ((event.body.toLowerCase() == "morning") || (event.body.toLowerCase() == "")) {
    return api.sendMessage("صباح الخير، نظف أسنانك 😚", threadID);
  };

  if ((event.body.toLowerCase() == "Rahat") || (event.body.toLowerCase() == "Rahat")) {
    return api.sendMessage("قل الحقيقة 🤬، هل تحب الرئيس؟", threadID);
  };

  if ((event.body.toLowerCase() == "রাহাত") || (event.body.toLowerCase() == "রাহাদ") || (event.body.toLowerCase() == "@rahat islam") || (event.body.toLowerCase() == "রাহাত")) {
    return api.sendMessage("هو مشغول الآن، يمكنك أن تقول لي ماذا تريد..! 😘", threadID);
  };

  if ((event.body.toLowerCase() == "owner") || (event.body.toLowerCase() == "ceo")) {
    return api.sendMessage("‎[المالك:☞ Rahat ", threadID);
  };

  if ((event.body.toLowerCase() == "Tor boss ke") || (event.body.toLowerCase() == "admin ke ")) {
    return api.sendMessage("مُنشئي: Rahat", threadID);
  };

  if ((event.body.toLowerCase() == "admin") || (event.body.toLowerCase() == "boter admin")) {
    return api.sendMessage("هو راهات ❤️ الجميع يعرفه باسم راهات 🤙", threadID);
  };

  if ((event.body.toLowerCase() == "ai") || (event.body.toLowerCase() == "Ai")) {
    return api.sendMessage("إذا أردت استخدام أمر AI، اكتب /ai", threadID);
  };

  if ((event.body.toLowerCase() == "chup") || (event.body.toLowerCase() == "stop") || (event.body.toLowerCase() == "চুপ কর") || (event.body.toLowerCase() == "chup kor")) {
    return api.sendMessage("اصمت يا مجنون", threadID);
  };

  if ((event.body.toLowerCase() == "আসসালামু আলাইকুম") || (event.body.toLowerCase() == "Assalamualaikum") || (event.body.toLowerCase() == "Assalamu alaikum") || (event.body.toLowerCase() == "Salam ")) {
    return api.sendMessage("️- وعليكم السلام 🖤", threadID);
  };

  if ((event.body.toLowerCase() == "sala ami tor boss") || (event.body.toLowerCase() == "sala ami ullas") || (event.body.toLowerCase() == "cup sala ami ullash") || (event.body.toLowerCase() == "madari")) {
    return api.sendMessage("آسف يا رئيس، اعذرني لن يحدث هذا مرة أخرى 🥺🙏", threadID);
  };

  if ((event.body.toLowerCase() == "@Farhana Ontora") || (event.body.toLowerCase() == "@Farhana Ontora ")) {
    return api.sendMessage("احذر، لا تذكر هذا الاسم، إنه لزوجة رئيسي راهات 😠🥰⛏️", threadID);
  };

  if ((event.body.toLowerCase() == "Farhana") || (event.body.toLowerCase() == "arohi")) {
    return api.sendMessage("احذر، لا تنادي بهذا الاسم، إنه لزوجة رئيسي راهات 😠🥰⛏️", threadID);
  };

  if ((event.body.toLowerCase() == "mim") || (event.body.toLowerCase() == "Mim")) {
    return api.sendMessage("احذر، لا تنادي بهذا الاسم، إنه لزوجة رئيسي راهات 😠🥰⛏️", threadID);
  };

  if ((event.body.toLowerCase() == "Arohi") || (event.body.toLowerCase() == "farhana")) {
    return api.sendMessage("احذر، لا تنادي بهذا الاسم، إنه لزوجة رئيسي راهات 😠🥰⛏️", threadID);
  };

  if ((event.body.toLowerCase() == "@MD Shiam Tafeder ") || (event.body.toLowerCase() == "সিয়াম")) {
    return api.sendMessage("🥰-Siam-🌺 صديق رئيسي راهات، لا تقترب أي فتاة 😠🥰⛏️", threadID);
  };

  if ((event.body.toLowerCase() == "KISS ME") || (event.body.toLowerCase() == "kiss me")) {
    return api.sendMessage("لن أعطيك قبلة 🤭", threadID);
  };

  if ((event.body.toLowerCase() == "tnx") || (event.body.toLowerCase() == "ধন্যবাদ") || (event.body.toLowerCase() == "thank you") || (event.body.toLowerCase() == "thanks")) {
    return api.sendMessage("لا تشكرني كثيرًا، اعثر على صديقة لرئيس راهات 🤬🌶️", threadID);
  };

  mess = "{name}";

  if (event.body.indexOf("/Bot") == 0 || (event.body.indexOf("/bot") == 0)) {
    var msg = {
      body: `${name}, ${rand}`
    }
    return api.sendMessage(msg, threadID, messageID);
  };

}

module.exports.run = function({ api, event, client, __GLOBAL }) { }
