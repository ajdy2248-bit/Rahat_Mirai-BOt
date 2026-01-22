module.exports = {
  config: {
    name: "age",
    version: "2.1",
    author: "🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰",
    hasPermission: 0,
    commandCategory: "utility",
    cooldowns: 5,
    description: "حساب العمر من تاريخ الميلاد",
    usage: "[DD/MM/YYYY]",
    dependencies: {
      "moment-timezone": "",
      "fs-extra": "",
      "axios": ""
    }
  },

  run: async function ({ api, event, args }) {
    const fs = require("fs-extra");
    const moment = require("moment-timezone");
    const axios = require("axios");

    try {
      
      if (!args[0]) {
        return api.sendMessage("⚠️ الرجاء إدخال تاريخ ميلادك بصيغة DD/MM/YYYY\nمثال: age 16/12/2006", event.threadID);
      }

      const input = args[0];
      const dateParts = input.split('/');
      
      if (dateParts.length !== 3) {
        return api.sendMessage("❌ صيغة التاريخ غير صحيحة. الرجاء استخدام DD/MM/YYYY", event.threadID);
      }

      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const year = parseInt(dateParts[2]);

      
      if (isNaN(day) || day < 1 || day > 31) {
        return api.sendMessage("❌ اليوم غير صالح (1-31)", event.threadID);
      }
      if (isNaN(month) || month < 1 || month > 12) {
        return api.sendMessage("❌ الشهر غير صالح (1-12)", event.threadID);
      }
      if (isNaN(year) || year < 1000 || year > new Date().getFullYear()) {
        return api.sendMessage("❌ السنة غير صحيحة", event.threadID);
      }

      
      const birthDate = moment.tz(`${year}-${month}-${day}`, "YYYY-MM-DD", "Asia/Dhaka");
      const now = moment.tz("Asia/Dhaka");
      
      if (birthDate.isAfter(now)) {
        return api.sendMessage("❌ لا يمكنك أن تكون مولودًا في المستقبل!", event.threadID);
      }

      const duration = moment.duration(now.diff(birthDate));
      
      
      const years = duration.years();
      const months = duration.months();
      const days = duration.days();
      const totalMonths = years * 12 + months;
      const totalDays = Math.floor(duration.asDays());
      const totalHours = Math.floor(duration.asHours());
      const totalMinutes = Math.floor(duration.asMinutes());
      const totalSeconds = Math.floor(duration.asSeconds());

      
      const avatarPath = `${__dirname}/cache/${event.senderID}.jpg`;
      const avatarUrl = `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      const response = await axios.get(avatarUrl, { responseType: 'stream' });
      const writer = fs.createWriteStream(avatarPath);
      response.data.pipe(writer);
      
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      
      const message = {
        body: `┏━━━━━━━━━━━━━━━━❂
┃            🎂 حَاسِب العُمْر 🎂
┣━━━━━━━━━━━━━━━━❂
┃✦ تاريخ الميلاد: ${day}/${month}/${year}
┃✦ العمر الحالي: ${years} سنة و ${months} شهر
┣━━━━[ التفاصيل ]━━━━❂
┃❖ ${totalMonths} أشهر
┃❖ ${totalDays} أيام
┃❖ ${totalHours} ساعات
┣━━━━━━━━━━━━━━━━❂
┃  تم الإنشاء بواسطة: ─꯭─⃝‌‌𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭
┗━━━━━━━━━━━━━━━━❂`,
        attachment: fs.createReadStream(avatarPath)
      };

      await api.sendMessage(message, event.threadID);
      fs.unlinkSync(avatarPath);

    } catch (error) {
      console.error("خطأ في أمر حساب العمر:", error);
      api.sendMessage("❌ حدث خطأ أثناء معالجة طلبك", event.threadID);
    }
  }
};
