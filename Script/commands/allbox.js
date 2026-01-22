module.exports.config = {
  name: 'allbox',
  version: '1.0.0',
  credits: '🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰',
  hasPermssion: 2,
  description: '[حظر/إلغاء الحظر/حذف/خروج] قائمة[البيانات] للمحادثات التي انضم إليها البوت.',
  commandCategory: 'Admin',
  usages: '[رقم الصفحة/الكل/@ذكر]',
  cooldowns: 5
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

// ===== Helper: Get Threads by User ID =====
async function getThreadsByUserID(api, userID) {
    try {
        const threadList = await api.getThreadList(100, null, ["INBOX"]);
        const userThreads = [];
        
        for (const thread of threadList) {
            if (thread.isGroup) {
                const threadInfo = await api.getThreadInfo(thread.threadID);
                const participants = threadInfo.participantIDs || [];
                
                if (participants.includes(userID)) {
                    userThreads.push({
                        threadName: thread.name,
                        threadID: thread.threadID,
                        messageCount: thread.messageCount,
                        isAdmin: threadInfo.adminIDs ? threadInfo.adminIDs.includes(userID) : false
                    });
                }
            }
        }
        
        return userThreads;
    } catch (error) {
        console.error("خطأ عند جلب المحادثات حسب المستخدم:", error);
        return [];
    }
}

module.exports.handleReply = async function ({ api, event, args, Threads, handleReply }) {
  const { threadID, messageID } = event;
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dhaka").format("HH:MM:ss L");
  var arg = event.body.split(" ");
  var idgr = handleReply.groupid[arg[1] - 1];
  var groupName = handleReply.groupName[arg[1] - 1];
  
  switch (handleReply.type) {
    case "reply":
      {
        if (arg[0] == "ban" || arg[0] == "Ban") {
          const data = (await Threads.getData(idgr)).data || {};
          data.banned = 1;
          data.dateAdded = time;
          await Threads.setData(idgr, { data });
          global.data.threadBanned.set(idgr, { dateAdded: data.dateAdded });
          return api.sendMessage(`»إشعارات من المالك 🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰\n\n🚫 تم حظر مجموعة الأصدقاء من استخدام البوت`, idgr, () =>
            api.sendMessage(`${api.getCurrentUserID()}`, () =>
              api.sendMessage(`★★تم الحظر بنجاح★★\n\n🔷${groupName} \n🔰TID:${idgr}`, threadID, () =>
                api.unsendMessage(handleReply.messageID))));
        }

        if (arg[0] == "unban" || arg[0] == "Unban" || arg[0] == "ub" || arg[0] == "Ub") {
          const data = (await Threads.getData(idgr)).data || {};
          data.banned = 0;
          data.dateAdded = null;
          await Threads.setData(idgr, { data });
          global.data.threadBanned.delete(idgr, 1);
          return api.sendMessage(`»إشعارات من المالك 🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰\n\n تم إزالة الحظر عن مجموعة الأصدقاء`, idgr, () =>
            api.sendMessage(`${api.getCurrentUserID()}`, () =>
              api.sendMessage(`★★تم إلغاء الحظر بنجاح★★\n\n🔷${groupName} \n🔰TID:${idgr} `, threadID, () =>
                api.unsendMessage(handleReply.messageID))));
        }

        if (arg[0] == "del" || arg[0] == "Del") {
          const data = (await Threads.getData(idgr)).data || {};
          await Threads.delData(idgr, { data });
          console.log(groupName)
          api.sendMessage(`★★تم حذف البيانات بنجاح★★\n\n🔷${groupName} \n🔰TID: ${idgr} \n تم حذف البيانات بنجاح!`, event.threadID, event.messageID);
          break;
        }

        if (arg[0] == "out" || arg[0] == "Out") {
          api.sendMessage(`»إشعارات من المالك 🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰\n\n ★★تم الحذف من المحادثة★★ المجموعة`, idgr, () =>
            api.sendMessage(`${api.getCurrentUserID()}`, () =>
              api.sendMessage(`★★تم الخروج بنجاح★★\n\n🔷${groupName} \n🔰TID:${idgr} `, threadID, () =>
                api.unsendMessage(handleReply.messageID, () =>
                  api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr)))));
          break;
        }
      }
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  
  // ===== Detect User ID from Mention/Reply/Link/UID =====
  let targetUserID = null;
  let showUserThreads = false;
  
  if (event.type === "message_reply") {
    targetUserID = event.messageReply.senderID;
    showUserThreads = true;
  } else if (args[0]) {
    if (args[0].indexOf(".com/") !== -1) {
      targetUserID = await api.getUID(args[0]);
      showUserThreads = true;
    } else if (args.join().includes("@")) {
      targetUserID = Object.keys(event.mentions || {})[0];
      if (!targetUserID) {
        targetUserID = await getUIDByFullName(api, event.threadID, args.join(" "));
      }
      showUserThreads = true;
    } else if (args[0] === "all") {
      showUserThreads = false;
    } else {
      if (/^\d+$/.test(args[0]) && args[0].length > 5) {
        targetUserID = args[0];
        showUserThreads = true;
      } else {
        showUserThreads = false;
      }
    }
  }
  
  if (showUserThreads && targetUserID) {
    try {
      const userThreads = await getThreadsByUserID(api, targetUserID);
      const userInfo = await api.getUserInfo(targetUserID);
      const userName = userInfo[targetUserID]?.name || "مستخدم غير معروف";
      
      if (userThreads.length === 0) {
        return api.sendMessage(`🔍 المستخدم "${userName}" (${targetUserID}) ليس عضوًا في أي مجموعة حيث يوجد البوت.`, threadID, messageID);
      }
      
      let msg = `📊 المجموعات الخاصة بـ: ${userName} (${targetUserID})\n`;
      msg += `📈 إجمالي المجموعات: ${userThreads.length}\n\n`;
      
      const groupid = [];
      const groupName = [];
      
      userThreads.forEach((thread, index) => {
        msg += `${index + 1}. ${thread.threadName}\n`;
        msg += `   🔰TID: ${thread.threadID}\n`;
        msg += `   💌الرسائل: ${thread.messageCount}\n`;
        msg += `   👑مشرف: ${thread.isAdmin ? "نعم" : "لا"}\n\n`;
        
        groupid.push(thread.threadID);
        groupName.push(thread.threadName);
      });
      
      msg += `\n🎭 للرد: استخدم ban/unban/del/out [رقم] لتنفيذ العملية على تلك المجموعة`;
      
      return api.sendMessage(msg, threadID, (e, data) => {
        if (e) return;
        global.client.handleReply.push({
          name: this.config.name,
          author: senderID,
          messageID: data.messageID,
          groupid,
          groupName,
          type: 'reply'
        });
      });
      
    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ حدث خطأ عند جلب مجموعات المستخدم. حاول مرة أخرى.", threadID, messageID);
    }
  }
  
  switch (args[0]) {
    case "all":
      {
        var threadList = [];
        var data, msg = "";
        try {
          data = await api.getThreadList(100, null, ["INBOX"]);
        } catch (e) {
          console.log(e);
        }
        for (const thread of data) {
          if (thread.isGroup == true) threadList.push({ threadName: thread.name, threadID: thread.threadID, messageCount: thread.messageCount });
        }

        threadList.sort((a, b) => {
          if (a.messageCount > b.messageCount) return -1;
          if (a.messageCount < b.messageCount) return 1;
        })

        var groupid = [];
        var groupName = [];
        var page = 1;
        page = parseInt(args[1]) || 1;
        page < -1 ? page = 1 : "";
        var limit = 100;
        var msg = "🎭قائمة المجموعات [البيانات]🎭\n\n";
        var numPage = Math.ceil(threadList.length / limit);

        for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
          if (i >= threadList.length) break;
          let group = threadList[i];
          msg += `${i + 1}. ${group.threadName}\n🔰TID: ${group.threadID}\n💌عدد الرسائل: ${group.messageCount}\n`;
          groupid.push(group.threadID);
          groupName.push(group.threadName);
        }
        msg += `--الصفحة ${page}/${numPage}--\nاستخدم ${global.config.PREFIX}allbox رقم الصفحة/الكل\n\n`

        api.sendMessage(msg + '🎭 للرد: استخدم Out, Ban, Unban, Del[data] على رقم الترتيب لتنفيذ العملية على تلك المجموعة!', event.threadID, (e, data) =>
          global.client.handleReply.push({
            name: this.config.name,
            author: event.senderID,
            messageID: data.messageID,
            groupid,
            groupName,
            type: 'reply'
          })
        )
      }
      break;

    default:
      {
        const { threadID, messageID } = event;
        var threadList = [];
        var data, msg = "";
        i = 1;
        try {
          data = global.data.allThreadID;
        } catch (e) {
          console.log(e);
        }
        for (const thread of data) {
          var nameThread = await global.data.threadInfo.get(thread).threadName || "الاسم غير موجود.";
          threadList.push(`${i++}. ${nameThread} \n🔰TID: ${thread}`);
        }
 
        return api.sendMessage(threadList.length != 0 ? 
          `🍄 حالياً هناك ${threadList.length} مجموعة\n\n${threadList.join("\n")}\n\n📌 الاستخدام: ${global.config.PREFIX}allbox [رقم الصفحة/الكل/@مستخدم/UID/رابط]` : 
          "لا توجد أي مجموعة حالياً!", threadID, messageID);
      }
  }
};
