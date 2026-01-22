const fs = global.nodemodule["fs-extra"];

module.exports.config = {
  name: "Obot",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰",
  description: "بوت للدردشة",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dhaka").format("HH:MM:ss L");
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  // قائمة الردود بالعربية فقط
  var replies = [
    "مرحبا 😄 كيف حالك اليوم؟",
    "أنا هنا 🤖",
    "تفضل، ما الذي تريد أن تسأل عنه؟",
    "أرسل لي أي شيء وسأرد عليك!",
    "لا تقلق، أنا معك 🌟",
    "حسنًا 😎، ماذا تريد أن تفعل الآن؟",
    "أنا جاهز لمساعدتك!",
    "أهلا بك من جديد 💛",
    "كيف كانت يومك؟",
    "يمكنك تجربة الأوامر الأخرى."
  ];

  var rand = replies[Math.floor(Math.random() * replies.length)];

  // أوامر محددة
  if ((event.body.toLowerCase() == "MISS YOU") || (event.body.toLowerCase() == "miss you")) {
    return api.sendMessage("أفتقدك الليلة 🥹🤖", threadID);
  }

  if ((event.body.toLowerCase() == "sim") || (event.body.toLowerCase() == "simsimi")) {
    return api.sendMessage("أمر simsimi غير متاح، جرب كتابة 'baby'", threadID);
  }

  if ((event.body.toLowerCase() == "bc") || (event.body.toLowerCase() == "mc")) {
    return api.sendMessage("وأنت أيضًا 😊", threadID);
  }

  if ((event.body.toLowerCase() == "morning")) {
    return api.sendMessage("صباح الخير 🌞، لا تنسى تنظيف أسنانك 😚", threadID);
  }

  if ((event.body.toLowerCase() == "Rahat") || (event.body.toLowerCase() == "رahat")) {
    return api.sendMessage("قل الحقيقة 🤬 هل تحب الرئيس؟", threadID);
  }

  if ((event.body.toLowerCase() == "owner") || (event.body.toLowerCase() == "ceo")) {
    return api.sendMessage("المالك: Rahat", threadID);
  }

  if ((event.body.toLowerCase() == "admin") || (event.body.toLowerCase() == "boter admin")) {
    return api.sendMessage("هو Rahat ❤️ الجميع يعرفه باسم Rahat 🤙", threadID);
  }

  if ((event.body.toLowerCase() == "ai") || (event.body.toLowerCase() == "Ai")) {
    return api.sendMessage("إذا أردت استخدام أمر الذكاء الاصطناعي، اكتب /ai", threadID);
  }

  if ((event.body.toLowerCase() == "chup") || (event.body.toLowerCase() == "stop") || (event.body.toLowerCase() == "چوپ")) {
    return api.sendMessage("اصمت مجنون 😅", threadID);
  }

  if ((event.body.toLowerCase() == "assalamualaikum") || (event.body.toLowerCase() == "السلام عليكم")) {
    return api.sendMessage("وعليكم السلام 🖤", threadID);
  }

  // أمر البوت بالعربية
  if (event.body.indexOf("/بوت") == 0) {
    var msg = {
      body: `${name}, ${rand}`
    };
    return api.sendMessage(msg, threadID, messageID);
  }
};

module.exports.run = function({ api, event, client, __GLOBAL }) { };
