module.exports.config = {
	name: "rnamebox",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "تغيير اسم جميع المجموعات",
	commandCategory: "System",
	usages: "[ضع الاسم الجديد هنا]",
	cooldowns: 20,
};

module.exports.run = async ({ event, api, args, Threads }) => {
    const custom = args.join(" "),
            allThread = await Threads.getAll(["threadID"]);
    var threadError = [],
        count = 0;
    if (custom.length != 0) {
        for (const idThread of allThread) {
            api.setTitle(custom, idThread.threadID, (err) => (err) ? threadError.push(idThread.threadID) : '');
            count+=1;
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return api.sendMessage(`تم تغيير الاسم بنجاح في ${count} مجموعة`, event.threadID, () => {
            if (threadError != 0) return api.sendMessage("[!] لا يمكن تغيير الاسم في " + threadError.length + " مجموعة", event.threadID, event.messageID)
        }, event.messageID);
    }
		}
