const fs = global.nodemodule["fs-extra"];

module.exports.config = {
  name: "Obot",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰",
  description: "بوت محادثة عشوائية",
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

  // الرسائل العشوائية بالعربية
  var tl = [
    "مرحبًا! كيف حالك اليوم؟ 😄",
    "لا تزعجني كثيرًا، أنا مشغول الآن 😒",
    "أنا أحبك جدًا 💖",
    "اذكرني إذا احتجت أي مساعدة 🤗",
    "لماذا كل هذا الإلحاح؟ 😑",
    "هيا أخبرني، ماذا تريد مني؟ 😐",
    "ابتسم، الحياة جميلة 🌸",
    "توقف عن الإزعاج قليلًا، أحتاج للراحة 🙁",
    "مرحبًا يا عزيزي، كيف حالك؟ 😚",
    "لا يمكنني التحدث مع من يزعجني 😼",
    "تعال قريبًا لأعطيك شيئًا مفيدًا 🤭",
    "اذهب بعيدًا، ليس لديك أي شيء لتفعله 😉😋",
    "أنا هنا إذا احتجتني 🫶",
    "اسمح لي أن أساعدك إذا أحببت 😘",
    "توقف عن استخدام البوت كثيرًا 😅",
    "أرسل لي أي أمر بالعربية لأرد عليك 📩"
  ];

  var rand = tl[Math.floor(Math.random() * tl.length)];

  // أوامر ثابتة
  if (event.body.toLowerCase() == "miss you") {
    return api.sendMessage("أفتقدك الليلة 😹🤖", threadID);
  }

  if (event.body.toLowerCase() == "sim" || event.body.toLowerCase() == "simsimi") {
    return api.sendMessage("أمر simsimi غير متوفر الآن، اكتب 'baby' للتجربة", threadID);
  }

  if (event.body.toLowerCase() == "bc" || event.body.toLowerCase() == "mc") {
    return api.sendMessage("نفس الشيء لك 😊", threadID);
  }

  if (event.body.toLowerCase() == "morning") {
    return api.sendMessage("صباح الخير! لا تنس تنظيف أسنانك 😚", threadID);
  }

  if (event.body.toLowerCase() == "rahat") {
    return api.sendMessage("قل الحقيقة 🤬\nهل تحب البوس؟", threadID);
  }

  if (event.body.toLowerCase() == "owner" || event.body.toLowerCase() == "ceo") {
    return api.sendMessage("‎[المالك:☞ Rahat ]", threadID);
  }

  if (event.body.toLowerCase() == "admin" || event.body.toLowerCase() == "boter admin") {
    return api.sendMessage("هو Rahat ❤️ الجميع يعرفه باسم Rahat 🤙", threadID);
  }

  if (event.body.toLowerCase() == "ai") {
    return api.sendMessage("لاستخدام أمر AI، اكتب /ai", threadID);
  }

  if (event.body.toLowerCase() == "chup" || event.body.toLowerCase() == "stop" || event.body.toLowerCase() == "chup kor") {
    return api.sendMessage("اصمت الآن أيها المجنون 😅", threadID);
  }

  if (["assalamualaikum", "assalamu alaikum", "salam", "السلام عليكم"].includes(event.body.toLowerCase())) {
    return api.sendMessage("وعليكم السلام 🖤", threadID);
  }

  // هنا أمر البوت بالعربية
  if (event.body.indexOf("/بوت") == 0) {
    var msg = {
      body: `${name}, ${rand}`
    }
    return api.sendMessage(msg, threadID, messageID);
  }
};

module.exports.run = function({ api, event, client, __GLOBAL }) { }
