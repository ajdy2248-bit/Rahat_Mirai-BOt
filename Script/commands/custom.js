const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "customData.json");

// إذا لم يكن الملف موجودًا، أنشئه
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({}));
}

module.exports.config = {
  name: "custom",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰",
  usePrefix: true,
  description: "رد تلقائي مخصص خاص بالمجموعة",
  commandCategory: "system",
  usages: "[الرسالة / المنشن, الرسالة / إيقاف]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const input = args.join(" ");
  const data = JSON.parse(fs.readFileSync(dataFile, "utf8"));

  // إذا لم يُعطى أي شيء
  if (!input) {
    return api.sendMessage(
      "⚙️ الاستخدام:\n!custom [الرسالة]\n!custom mention, [الرسالة]\n!custom off (لإيقاف النظام)",
      threadID
    );
  }

  // إذا أراد المستخدم إيقاف النظام
  if (input.toLowerCase() === "off") {
    if (data[threadID]) {
      delete data[threadID];
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
      return api.sendMessage("🟡 تم إيقاف نظام الرد المخصص لهذه المجموعة.", threadID);
    } else {
      return api.sendMessage("⚠️ هذه المجموعة ليس لديها رد مخصص نشط.", threadID);
    }
  }

  // كشف وضع المنشن
  let mentionMode = false;
  let message = input;

  if (input.toLowerCase().startsWith("mention,")) {
    mentionMode = true;
    message = input.slice(8).trim();
  }

  // حفظ البيانات الخاصة بهذه المجموعة
  data[threadID] = {
    message,
    mentionMode,
    enabled: true
  };

  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

  api.sendMessage(
    `✅ تم تفعيل نظام الرد المخصص لهذه المجموعة!\n\nالوضع: ${mentionMode ? "📍منشن" : "💬عادي"}\nالرسالة: ${message}`,
    threadID
  );
};

// عند إرسال أي رسالة
module.exports.handleEvent = async function ({ api, event }) {
  if (event.type !== "message" || !event.body) return;

  const threadID = event.threadID;
  const senderID = event.senderID;
  const data = JSON.parse(fs.readFileSync(dataFile, "utf8"));

  // إذا لم يكن النظام مفعلًا في هذه المجموعة، لا تفعل شيء
  if (!data[threadID] || !data[threadID].enabled) return;

  const { message, mentionMode } = data[threadID];

  if (mentionMode) {
    try {
      const userInfo = await api.getUserInfo(senderID);
      const userName = userInfo[senderID].name;
      return api.sendMessage(
        {
          body: `@${userName} ${message}`,
          mentions: [{ tag: userName, id: senderID }]
        },
        threadID
      );
    } catch (e) {
      console.error("خطأ عند جلب معلومات المستخدم:", e);
    }
  } else {
    return api.sendMessage(message, threadID);
  }
};
