const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
 name: "notice",
 version: "1.0.0",
 hasPermssion: 2, 
 credits: "🔰Rahat🔰",
 description: "إرسال إشعار لجميع المجموعات (نص، صورة، فيديو، صوت، أو ملف)",
 commandCategory: "Admin",
 usages: "/notice <نص> أو قم بالرد على رسالة للإرسال",
 cooldowns: 5,
};

module.exports.run = async ({ api, event, args, Users }) => {
 try {
 const allThreads = global.data.allThreadID || [];
 const senderName = await Users.getNameUser(event.senderID);
 let successCount = 0;
 let failedCount = 0;

 if (event.type === "message_reply") {
 const replyMsg = event.messageReply;
 const attachments = replyMsg.attachments || [];

 for (const attachment of attachments) {
 const fileUrl = attachment.url;
 const fileName = path.basename(fileUrl);
 const filePath = path.join(__dirname, `cache/${fileName}`);

 try {
 const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
 await fs.writeFile(filePath, Buffer.from(response.data, "binary"));

 for (const threadID of allThreads) {
 if (threadID != event.threadID) { 
 try {
 await api.sendMessage(
 {
 body: `📢 إشعار من الإدارة: (${senderName})\n\n${replyMsg.body || args.join(" ")}`,
 attachment: fs.createReadStream(filePath),
 },
 threadID
 );
 successCount++;
 } catch (error) {
 failedCount++;
 console.error(`فشل الإرسال إلى ${threadID}:`, error);
 }
 await new Promise((resolve) => setTimeout(resolve, 1000)); // لتجنب الحد الأقصى للإرسال
 }
 }

 await fs.unlink(filePath);
 } catch (error) {
 console.error("خطأ في تحميل/إرسال الملف:", error);
 api.sendMessage("❌ حدثت مشكلة أثناء إرسال الملف!", event.threadID);
 }
 }
 } 
 
 else if (args.length > 0) {
 const noticeText = args.join(" ");

 for (const threadID of allThreads) {
 if (threadID != event.threadID) {
 try {
 await api.sendMessage(
 `📢 إشعار (${senderName}):\n${noticeText}`,
 threadID
 );
 successCount++;
 } catch (error) {
 failedCount++;
 console.error(`فشل الإرسال إلى ${threadID}:`, error);
 }
 await new Promise((resolve) => setTimeout(resolve, 500)); // لتجنب الحد الأقصى للإرسال
 }
 }
 } else {
 return api.sendMessage(
 "ℹ️ الاستخدام:\n• `/notice <نص>`\n• أو قم بالرد على أي رسالة واكتب `/notice`",
 event.threadID
 );
 }

 api.sendMessage(
 `✅ تم إرسال الإشعار إلى ${successCount} مجموعة!\n❌ لم يتم الإرسال إلى ${failedCount} مجموعة.`,
 event.threadID
 );
 } catch (error) {
 console.error("خطأ عام:", error);
 api.sendMessage("❌ حدثت مشكلة أثناء إرسال الإشعار!", event.threadID);
 }
};
