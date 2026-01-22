Entermodule.exports.config = {
    name: "3card",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "",
    description: "لعبة ثلاث ورقات للمجموعات مع رهان (مع صور الكروت)",
    commandCategory: "لعبة",
    usages: "[start/join/info/leave]",
    cooldowns: 1
};

const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const suits = ["spades", "hearts", "diamonds", "clubs"];
const deck = [];

// إنشاء مجموعة الكروت
for (let i = 0; i < values.length; i++) {
  for (let x = 0; x < suits.length; x++) {
    let weight = parseInt(values[i]);
    if (["J", "Q", "K"].includes(values[i])) weight = 10;
    else if (values[i] == "A") weight = 11;

    const card = {
      Value: values[i],
      Suit: suits[x],
      Weight: weight,
      Icon: suits[x] == "spades" ? "♠️" : suits[x] == "hearts" ? "♥️" : suits[x] == "diamonds" ? "♦️" : "♣️"
    };
    deck.push(card);
  }
}

// خلط الكروت
function createDeck() {
  const deckShuffled = [...deck];
  for (let i = 0; i < 1000; i++) {
    const loc1 = Math.floor(Math.random() * deckShuffled.length);
    const loc2 = Math.floor(Math.random() * deckShuffled.length);
    const tmp = deckShuffled[loc1];
    deckShuffled[loc1] = deckShuffled[loc2];
    deckShuffled[loc2] = tmp;
  }
  return deckShuffled;
}

// رابط صورة الكرت
function getCardLink(Value, Suit) {
  return `https://raw.githubusercontent.com/ntkhang03/poker-cards/main/cards/${Value == "J" ? "jack" : Value == "Q" ? "queen" : Value == "K" ? "king" : Value == "A" ? "ace" : Value}_of_${Suit}.png`;
}

// دمج صور الكروت
async function drawCard(cards) {
  const Canvas = require("canvas");
  const canvas = Canvas.createCanvas(500 * cards.length, 726);
  const ctx = canvas.getContext("2d");
  let x = 0;
  for (const card of cards) {
    const img = await Canvas.loadImage(card);
    ctx.drawImage(img, x, 0);
    x += 500;
  }
  return canvas.toBuffer();
}

// التعامل مع الأحداث
module.exports.handleEvent = async ({ Currencies, event, api, Users }) => {
  const fs = require("fs-extra");
  const { senderID, threadID, body, messageID } = event;

  if (!body) return;
  if (!global.moduleData.threecards) global.moduleData.threecards = new Map();
  if (!global.moduleData.threecards.has(threadID)) return;

  const values = global.moduleData.threecards.get(threadID);
  if (values.start != 1) return;

  const deckShuffled = values.deckShuffled;

  // توزيع الكروت
  if (body.toLowerCase().startsWith("deal cards")) {
    if (values.dealt == 1) return;

    for (const key in values.player) {
      const card1 = deckShuffled.shift();
      const card2 = deckShuffled.shift();
      const card3 = deckShuffled.shift();

      let total = card1.Weight + card2.Weight + card3.Weight;
      if (total >= 20) total -= 20;
      if (total >= 10) total -= 10;

      values.player[key].card1 = card1;
      values.player[key].card2 = card2;
      values.player[key].card3 = card3;
      values.player[key].total = total;

      const cardLinks = [];
      for (let i = 1; i <= 3; i++) {
        const c = values.player[key]["card" + i];
        cardLinks.push(getCardLink(c.Value, c.Suit));
      }

      const pathSave = __dirname + `/cache/card${values.player[key].id}.png`;
      fs.writeFileSync(pathSave, await drawCard(cardLinks));

      api.sendMessage({
        body: `كروتك: ${card1.Value}${card1.Icon} | ${card2.Value}${card2.Icon} | ${card3.Value}${card3.Icon}\n\nالمجموع: ${total}`,
        attachment: fs.createReadStream(pathSave)
      }, values.player[key].id, () => fs.unlinkSync(pathSave));
    }

    values.dealt = 1;
    global.moduleData.threecards.set(threadID, values);
    return api.sendMessage("تم توزيع الكروت! لكل لاعب فرصتان للتبديل.", threadID);
  }

  // تبديل كرت
  if (body.toLowerCase().startsWith("swap card")) {
    if (values.dealt != 1) return;
    const player = values.player.find(p => p.id == senderID);
    if (player.swaps == 0) return api.sendMessage("لقد استعملت كل فرص التبديل.", threadID, messageID);
    if (player.ready) return api.sendMessage("أنت جاهز بالفعل، لا يمكنك التبديل.", threadID, messageID);

    const cards = ["card1", "card2", "card3"];
    player[cards[Math.floor(Math.random() * cards.length)]] = deckShuffled.shift();
    player.total = player.card1.Weight + player.card2.Weight + player.card3.Weight;
    if (player.total >= 20) player.total -= 20;
    if (player.total >= 10) player.total -= 10;
    player.swaps -= 1;

    global.moduleData.threecards.set(threadID, values);

    return api.sendMessage(
      `تم تبديل كرت.\nالمجموع الجديد: ${player.total}`,
      threadID,
      messageID
    );
  }

  // جاهز
  if (body.toLowerCase().startsWith("ready")) {
    if (values.dealt != 1) return;
    const player = values.player.find(p => p.id == senderID);
    if (player.ready) return;

    values.ready += 1;
    player.ready = true;

    if (values.player.length == values.ready) {
      values.player.sort((a, b) => b.total - a.total);

      let result = [], rank = 1;
      for (const p of values.player) {
        const name = await Users.getNameUser(p.id);
        result.push(`${rank++} • ${name} => ${p.total} نقطة`);
      }

      await Currencies.increaseMoney(values.player[0].id, values.betAmount * values.player.length);
      global.moduleData.threecards.delete(threadID);

      return api.sendMessage(
        `النتائج:\n\n${result.join("\n")}\n\nالفائز يحصل على: ${values.betAmount * values.player.length}$`,
        threadID
      );
    } else {
      return api.sendMessage("تم تسجيلك كجاهز، في انتظار باقي اللاعبين.", threadID);
    }
  }
};

// أوامر اللعبة
module.exports.run = async ({ api, event, args, Currencies }) => {
  const { senderID, threadID, messageID } = event;

  if (!args[0]) {
    return api.sendMessage(
`===== طاولة ثلاث ورقات =====
مرحباً بك في عالم الرهانات 🎲

الأوامر:
» 3cards create [المبلغ]
» 3cards start
» 3cards info
» 3cards leave
» Deal Cards
» Swap Card
» Ready
» Nonready`,
      threadID,
      messageID
    );
  }
};
