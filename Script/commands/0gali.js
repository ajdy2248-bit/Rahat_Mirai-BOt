const fs = require("fs");

module.exports.config = {
	name: "gali",
	version: "1.0.1",
	hasPermssion: 2,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭", // Modify by rX
	description: "لا تقم بتغيير الحقوق",
	commandCategory: "بدون بادئة",
	usages: "mgi",
	cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;

	if (
		event.body.indexOf("Mgi") == 0 ||
		event.body.indexOf("Khanki") == 0 ||
		event.body.indexOf("Mg") == 0 ||
		event.body.indexOf("Magi") == 0
	) {
		var msg = {
			body: "هذا الكلام غير مقبول",
			attachment: fs.createReadStream(__dirname + `/noprefix/nupure.mp3`)
		};

		api.sendMessage(msg, threadID, messageID);
		api.setMessageReaction("😡", event.messageID, (err) => {}, true);
	}
};

module.exports.run = function({ api, event, client, __GLOBAL }) {

};
