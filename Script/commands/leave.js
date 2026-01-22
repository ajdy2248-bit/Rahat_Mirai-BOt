module.exports.config = {
    name: "leave",
    version: "1.0.0",
    hasPermssion: 2,  // فقط المستخدمون بمستوى ادمن يمكنهم التشغيل
    credits: "rX عبدالله",
    description: "اجعل البوت يغادر المجموعة",
    commandCategory: "النظام", // 🔑 بدون هذا لن يعمل
    usages: "leave",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    const { threadID } = event;
    api.sendMessage("👋 البوت سيغادر هذه المجموعة!", threadID, () => {
        api.removeUserFromGroup(api.getCurrentUserID(), threadID);
    });
};
