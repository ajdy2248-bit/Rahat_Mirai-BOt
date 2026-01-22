const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "4k",
    version: "1.0",
    credits: "🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰",
    description: "تحسين الصورة إلى دقة 4K باستخدام API",
    usages: "!4k (رد على صورة)",
    commandCategory: "AI",
    cooldowns: 5
};

const API_ENDPOINT = "https://free-goat-api.onrender.com/4k";

function extractImageUrl(event) {
    if (event.messageReply && event.messageReply.attachments?.length > 0) {
        const img = event.messageReply.attachments.find(
            a => a.type === "photo" || a.type === "image"
        );
        if (img?.url) return img.url;
    }
    return null;
}

module.exports.run = async function ({ api, event, args }) {

    const imageUrl = extractImageUrl(event);

    if (!imageUrl)
        return api.sendMessage("❌ الرجاء الرد على صورة.", event.threadID, event.messageID);

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    let tempFile;

    try {
        const fullApiUrl = `${API_ENDPOINT}?url=${encodeURIComponent(imageUrl)}`;

        const apiRes = await axios.get(fullApiUrl);
        const data = apiRes.data;

        if (!data.image)
            throw new Error("لم يُرجع الـ API رابط للصورة");

        const finalUrl = data.image;

        const imgStream = await axios.get(finalUrl, { responseType: "stream" });

        const cache = path.join(__dirname, "/cache");
        if (!fs.existsSync(cache)) fs.mkdirSync(cache);

        tempFile = path.join(cache, `4k_edit_${Date.now()}.jpg`);

        const writer = fs.createWriteStream(tempFile);
        imgStream.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        api.setMessageReaction("✅", event.messageID, () => {}, true);

        return api.sendMessage(
            {
                body: `✅ تم التحسين بنجاح`,
                attachment: fs.createReadStream(tempFile)
            },
            event.threadID,
            () => fs.unlinkSync(tempFile),
            event.messageID
        );

    } catch (err) {
        console.log("خطأ في تحسين الصورة 4K:", err);

        api.setMessageReaction("❌", event.messageID, () => {}, true);

        return api.sendMessage(
            `❌ خطأ: ${err.message || "حدث خطأ ما."}`,
            event.threadID,
            event.messageID
        );
    }
};
