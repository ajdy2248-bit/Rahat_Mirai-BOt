var request = require("request");
const { readdirSync, readFileSync, writeFileSync, existsSync, copySync, createWriteStream, createReadStream } = require("fs-extra");

module.exports.config = {
	name: "0admin",
	version: "1.0.5",
	hasPermssion: 3,
	credits: "🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰",
	description: "إعدادات الإدارة",
	commandCategory: "Admin",
	usages: "Admin [الأمر] [@منشن/رد/UID/رابط/اسم]",
	cooldowns: 2,
	dependencies: {
		"fs-extra": ""
	}
};

module.exports.languages = {
	"vi": {
		"listAdmin": `===「 قائمة الإدمن 」===\n━━━━━━━━━━━━━━━\n%1\n\n==「 داعمي البوت 」==\n━━━━━━━━━━━━━━━\n%2`,
		"notHavePermssion": 'الوضع - ليس لديك الصلاحية لاستخدام الأمر "%1"',
		"addedNewAdmin": 'الوضع - تم إضافة %1 مستخدم كإدمن بنجاح\n\n%2',
		"addedNewNDH": 'الوضع - تم إضافة %1 مستخدم كداعم بنجاح\n\n%2',
		"removedAdmin": 'الوضع - تم إزالة صلاحية الإدمن من %1 مستخدم\n\n%2',
		"removedNDH": 'الوضع - تم إزالة صلاحية الدعم من %1 مستخدم\n\n%2'
	},
	"en": {
		"listAdmin": '[Admin] قائمة الإدمن:\n\n%1',
		"notHavePermssion": '[Admin] ليس لديك صلاحية لاستخدام "%1"',
		"addedNewAdmin": '[Admin] تمت إضافة %1 كإدمن:\n\n%2',
		"removedAdmin": '[Admin] تم حذف %1 من الإدمن:\n\n%2'
	}
};

// ===== Helper: Full Name Mention Detection =====
async function getUIDByFullName(api, threadID, body) {
	if (!body.includes("@")) return null;
	const match = body.match(/@(.+)/);
	if (!match) return null;
	const targetName = match[1].trim().toLowerCase().replace(/\s+/g, " ");
	const threadInfo = await api.getThreadInfo(threadID);
	const users = threadInfo.userInfo || [];
	const user = users.find(u => {
		if (!u.name) return false;
		const fullName = u.name.trim().toLowerCase().replace(/\s+/g, " ");
		return fullName === targetName;
	});
	return user ? user.id : null;
}

// ===== Helper: Get Target User =====
async function getTargetUser(api, event, args, Users) {
	let targetID;
	let targetName;

	if (event.type === "message_reply") {
		targetID = event.messageReply.senderID;
		targetName = (await Users.getData(targetID)).name;
	} else if (args[0]) {
		if (args[0].indexOf(".com/") !== -1) {
			targetID = await api.getUID(args[0]);
			targetName = (await Users.getData(targetID)).name;
		} else if (args.join().includes("@")) {
			targetID = Object.keys(event.mentions || {})[0];
			if (targetID) {
				targetName = event.mentions[targetID];
			} else {
				targetID = await getUIDByFullName(api, event.threadID, args.join(" "));
				if (targetID) {
					targetName = (await Users.getData(targetID)).name;
				}
			}
		} else {
			targetID = args[0];
			targetName = (await Users.getData(targetID)).name;
		}
	}

	return { targetID, targetName };
}

module.exports.onLoad = function() {
	const { writeFileSync, existsSync } = require('fs-extra');
	const { resolve } = require("path");
	const path = resolve(__dirname, 'cache', 'data.json');
	if (!existsSync(path)) {
		const obj = {
			adminbox: {}
		};
		writeFileSync(path, JSON.stringify(obj, null, 4));
	} else {
		const data = require(path);
		if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
		writeFileSync(path, JSON.stringify(data, null, 4));
	}
}

module.exports.run = async function ({ api, event, args, Users, permssion, getText }) {
	const content = args.slice(1, args.length);
	if (args.length == 0)
		return api.sendMessage({
			body:
`==== [ إعدادات الإدارة ] ====
━━━━━━━━━━━━━━━
الوضع - admin list => عرض قائمة الإدمن والداعمين
الوضع - admin add => إضافة مستخدم كإدمن
الوضع - admin remove => إزالة إدمن
الوضع - admin addndh => إضافة مستخدم كداعم
الوضع - admin removendh => إزالة داعم
الوضع - admin qtvonly => تفعيل وضع الإدمن فقط داخل المجموعة
الوضع - admin ndhonly => تفعيل وضع الداعمين فقط
الوضع - admin only => تفعيل وضع الإدمن فقط
الوضع - admin ibonly => الإدمن فقط في الخاص
━━━━━━━━━━━━━━━
الاستخدام => ${global.config.PREFIX}admin [الأمر]`
		}, event.threadID, event.messageID);

	const { threadID, messageID } = event;
	const { configPath } = global.client;
	const { ADMINBOT, NDH } = global.config;
	const { writeFileSync } = global.nodemodule["fs-extra"];

	delete require.cache[require.resolve(configPath)];
	var config = require(configPath);

	switch (args[0]) {

		case 'qtvonly': {
			const { resolve } = require("path");
			const pathData = resolve(__dirname, 'cache', 'data.json');
			const database = require(pathData);
			const { adminbox } = database;

			if (permssion < 1)
				return api.sendMessage("الوضع - ليس لديك الصلاحية 🎀", threadID, messageID);

			if (adminbox[threadID] == true) {
				adminbox[threadID] = false;
				api.sendMessage("الوضع » تم تعطيل وضع الإدمن فقط، الجميع يمكنه استخدام البوت 👀", threadID, messageID);
			} else {
				adminbox[threadID] = true;
				api.sendMessage("الوضع » تم تفعيل وضع الإدمن فقط، الإدمن فقط يمكنهم استخدام البوت 👀", threadID, messageID);
			}
			writeFileSync(pathData, JSON.stringify(database, null, 4));
			break;
		}

		case 'ndhonly': {
			if (permssion < 2)
				return api.sendMessage("الوضع - ليس لديك الصلاحية 🎀", threadID, messageID);

			if (config.ndhOnly == false) {
				config.ndhOnly = true;
				api.sendMessage("الوضع » تم تفعيل وضع الداعمين فقط 👾", threadID, messageID);
			} else {
				config.ndhOnly = false;
				api.sendMessage("الوضع » تم تعطيل وضع الداعمين فقط 👾", threadID, messageID);
			}
			writeFileSync(configPath, JSON.stringify(config, null, 4));
			break;
		}

		case 'only': {
			if (permssion != 3)
				return api.sendMessage("الوضع - ليس لديك الصلاحية 🎀", threadID, messageID);

			if (config.adminOnly == false) {
				config.adminOnly = true;
				api.sendMessage("الوضع » تم تفعيل وضع الإدمن فقط 👑", threadID, messageID);
			} else {
				config.adminOnly = false;
				api.sendMessage("الوضع » تم تعطيل وضع الإدمن فقط 👑", threadID, messageID);
			}
			writeFileSync(configPath, JSON.stringify(config, null, 4));
			break;
		}

		default:
			return global.utils.throwError(this.config.name, threadID, messageID);
	}
};
