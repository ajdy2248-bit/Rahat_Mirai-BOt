module.exports.config = {

  name: "imagesearch",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "ابحث عن صورة",
  commandCategory: "image",
  usages: "imagesearch [نص]",
  cooldowns: 5,
  dependencies: {
     "axios":"",
     "fs-extra":"",
     "googlethis":"",
     "cloudscraper":""
  }
};

module.exports.run = async ({matches, event, api, extra, args}) => {

    const axios = global.nodemodule['axios'];
    const google = global.nodemodule["googlethis"];
    const cloudscraper = global.nodemodule["cloudscraper"];
    const fs = global.nodemodule["fs"];
    
    try{
        var query = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
        api.sendMessage(`🔎 جاري البحث عن: ${query}...`, event.threadID, event.messageID);

        let result = await google.image(query, {safe: false});
        if(result.length === 0) {
            api.sendMessage(`⚠️ لم يتم العثور على أي نتائج للبحث عن الصورة.`, event.threadID, event.messageID)
            return;
        }

        let streams = [];
        let counter = 0;

        console.log(result)

        for(let image of result) {
            // عرض 6 صور فقط
            if(counter >= 6)
                break;

            console.log(`${counter}: ${image.url}`);

            // تجاهل الروابط التي لا تنتهي بـ .jpg أو .png
            let url = image.url;
            if(!url.endsWith(".jpg") && !url.endsWith(".png"))
                continue;

            let path = __dirname + `/cache/search-image-${counter}.jpg`;
            let hasError = false;
            
            await cloudscraper.get({uri: url, encoding: null})
                .then((buffer) => fs.writeFileSync(path, buffer))
                .catch((error) => {
                    console.log(error)
                    hasError = true;
                });

            if(hasError)
                continue;

            console.log(`تمت الإضافة إلى التدفقات: ${path}`) ;
            streams.push(fs.createReadStream(path).on("end", async () => {
                if(fs.existsSync(path)) {
                    fs.unlink(path, (err) => {
                        if(err) return console.log(err);
                        console.log(`تم حذف الملف: ${path}`);
                    });
                }
            }));

            counter += 1;
        }

        api.sendMessage("⏳ جاري إرسال نتائج البحث...", event.threadID, event.messageID)

        let msg = {
            body: `--------------------\nنتائج البحث عن الصور\n"${query}"\n\nتم العثور على: ${result.length} صورة${result.length > 1 ? 's' : ''}\nعرض فقط: 6 صور\n\n--------------------`,
            attachment: streams
        };

        api.sendMessage(msg, event.threadID, event.messageID);

    }catch(e){
        console.log("ERR: "+e)
        api.sendMessage("⚠️ خطأ: "+e, event.threadID, event.messageID);
    }
};
