module.exports.config = {
    name: "boom",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰",
    description: "حرب في صندوق الدردشة",
    commandCategory: "wargroup",
    usages: "[fyt]",
    cooldowns: 7,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
}

module.exports.run = async function({ api, args, Users, event}) {
 var mention = Object.keys(event.mentions)[0];
    
 let name =  event.mentions[mention];
    var arraytag = [];
        arraytag.push({id: mention});
    var a = function (a) { api.sendMessage(a, event.threadID); }

a("💥 انفجار كبير 💣😂😂🔥");

setTimeout(() => {a({body: "💥 استمر الانفجار! 💣🔥😂"})}, 3000);
setTimeout(() => {a({body: "💥 المزيد من التفجيرات هنا! 💣😂"})}, 6000);
setTimeout(() => {a({body: "💥 استمر في الفوضى! 😂😂🔥"})}, 9000);
setTimeout(() => {a({body: "💥 هل تستطيع النجاة؟ 😂🔥"})}, 12000);
setTimeout(() => {a({body: "💥 انفجار آخر! 😝🔥"})}, 15000);
setTimeout(() => {a({body: "💥 لا تهرب 😂😂"})}, 18000);
setTimeout(() => {a({body: "💥 استعد للصدمة القادمة! 😂"})}, 21000);
setTimeout(() => {a({body: "💥 الكارثة مستمرة! 😱🔥"})}, 24000);
setTimeout(() => {a({body: "💥 هجوم قوي قادم! 😂😂"})}, 27000);
setTimeout(() => {a({body: "💥 انفجارات متتابعة! 😝🔥"})}, 30000);
setTimeout(() => {a({body: "💥 لا مكان للاختباء! 😂😂"})}, 33000);
setTimeout(() => {a({body: "💥 الدمار مستمر! 😱🔥"})}, 36000);
setTimeout(() => {a({body: "💥 انفجار رهيب جدًا! 😂😂"})}, 39000);
setTimeout(() => {a({body: "💥 كل شيء يتفجر حولك! 😝😂"})}, 40000);
setTimeout(() => {a({body: "💥 الفوضى الكاملة 😆🔥"})}, 43000);
setTimeout(() => {a({body: "💥 لا توقف الضحك 😂😂"})}, 46000);
setTimeout(() => {a({body: "💥 انفجار آخر قادم! 😝😂"})}, 49000);
setTimeout(() => {a({body: "💥 استعد للفوضى! 😂🔥"})}, 52000);
setTimeout(() => {a({body: "💥 المزيد من الانفجارات 😝😂"})}, 55000);
setTimeout(() => {a({body: "💥 الانفجار النهائي! 😂😂"})}, 58000);
setTimeout(() => {a({body: "💥 كل شيء ينهار من حولك 😱🔥"})}, 60000);
setTimeout(() => {a({body: "💥 انفجارات مستمرة! 😂😂"})}, 63000);
setTimeout(() => {a({body: "💥 هجوم متواصل 💣🔥"})}, 66000);
setTimeout(() => {a({body: "💥 الفوضى مستمرة 💥😂"})}, 69000);
setTimeout(() => {a({body: "❤️❤️❤️ انفجار حب ودمار 😂🔥"})}, 72000);
setTimeout(() => {a({body: "💥 انفجار مذهل 😝🔥"})}, 75000);
setTimeout(() => {a({body: "😂😂😂 كل شيء يتفجر حولك!"})}, 78000);
    }
