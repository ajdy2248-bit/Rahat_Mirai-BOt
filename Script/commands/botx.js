module.exports.config = {
  name: "otherbots",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰",
  description: "حظر البوتات الأخرى",
  commandCategory: "config",
  cooldowns: 0
};

module.exports.handleEvent = async function({ event, api, Users }) {
  const { threadID, messageID, body, senderID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Kolkata").format("HH:MM:ss L");
  
  // تحقق حتى لا يتم حظر البوت نفسه
  if (senderID == api.getCurrentUserID()) return;
  
  // تحقق إذا كان المستخدم محظور بالفعل
  if (global.data.userBanned && global.data.userBanned.has(senderID)) return;
  
  const userName = await Users.getNameUser(senderID);
  
  // كلمات مفتاحية لاكتشاف رسائل البوت
  const botKeywords = [
    "مستوى لوحة المفاتيح الخاص بك وصل للمستوى",
    "الأمر غير موجود",
    "الأمر الذي استخدمته",
    "إلغاء إرسال هذه الرسالة",
    "لا يمكنك استخدام البوت",
    "»» إشعار «« تحديث ألقاب المستخدمين",
    "تمت إزالة مرفق واحد فقط",
    "تمت إزالة محتوى الرسالة",
    "الإعداد الحالي هو",
    "هذا هو البادئة الخاص بي",
    "غير قادر على إعادة إضافة الأعضاء",
    "تمت إزالة محتوى رسالة واحدة:",
    "إليك موسيقاك، استمتع!🥰",
    "مستوى قوة لوحة المفاتيح ارتفع",
    "مستوى البطل الخاص بلوحة المفاتيح وصل للمستوى",
    "خطأ: لا يمكن قراءة خصائص غير معرفة",
    "خطأ في الدردشة: فشل الطلب برمز الحالة 500",
    "خطأ: فشل في جلب القائمة",
    "⚠️ حدث خطأ، يرجى المحاولة لاحقًا.",
    "ماذا هناك؟",
    "❌ الرجاء توفير سؤال أو موجه.",
    "مرحبًا! كيف يمكنني مساعدتك اليوم؟",
    "انتظر قليلاً",
    "فشل التوليد!",
    "خطأ: فشل الطلب برمز الحالة 404",
    "فشل الطلب برمز الحالة 500.",
    "خطأ",
    "❌ خطأ",
    "❌ الرجاء تقديم رابط صورة",
    "نعم 😀، أنا هنا",
    "السلام عليكم",
    "🔍 تم اكتشاف المنصة: TikTok",
    "⚠️ عذرًا، لم أتمكن من إعادة إضافة المستخدم",
    "مرحبًا يا سيدي!",
    "رسالة تحذير من البوت",
    "تم اكتشاف هذا المستخدم كبوت",
    "هذا الأمر يستخدم لاكتشاف البوتات الأخرى وحظرها فورًا لتجنب الرسائل المزعجة",
    "لقد حظرتك لأنك بوت 🤬\nلن تتلقى أي رد مني بعد الآن🥴"
  ];
  
  // اكتشاف رسالة بوت
  const isBotMessage = botKeywords.some(keyword => body && body.includes(keyword));
  
  if (isBotMessage) {
    console.log(`[ BOT BAN ] ${userName} (${senderID}) تم اكتشافه كبوت`);
    
    // تحميل بيانات المستخدم
    const userData = await Users.getData(senderID);
    
    // تعيين الحظر
    if (!global.data.userBanned) global.data.userBanned = new Map();
    
    global.data.userBanned.set(senderID, {
      reason: "تم اكتشافه تلقائيًا كبوت آخر",
      dateAdded: time
    });
    
    // تحديث بيانات المستخدم
    userData.banned = 1;
    userData.reason = "تم اكتشافه تلقائيًا كبوت آخر";
    userData.dateAdded = time;
    await Users.setData(senderID, userData);
    
    // إرسال رسالة للمستخدم
    const replyMessage = {
      body: `${userName}\n🤬 لقد حظرتك لأنك بوت\nلن تتلقى أي رد مني بعد الآن🥴`
    };
    
    api.sendMessage(replyMessage, threadID, async () => {
      // إشعار الإداريين
      if (global.config.ADMINBOT && Array.isArray(global.config.ADMINBOT)) {
        const adminMessage = `⚠️ تنبيه اكتشاف بوت ⚠️\n\nالاسم: ${userName}\nمعرف المستخدم: ${senderID}\nمعرف المحادثة: ${threadID}\nالوقت: ${time}\n\nتم حظر هذا المستخدم تلقائيًا لإرساله رسائل بوت.`;
        
        for (const adminID of global.config.ADMINBOT) {
          try {
            await api.sendMessage(adminMessage, adminID);
          } catch (error) {
            console.error("فشل في إشعار الإداري:", adminID, error);
          }
        }
      }
    }, messageID);
  }
};

module.exports.run = async function({ event, api }) {
  api.sendMessage("هذا الأمر يستخدم لاكتشاف البوتات الأخرى وحظرها فورًا لتجنب الرسائل المزعجة", event.threadID);
};
