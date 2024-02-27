const { Bot } = require("grammy");
require("dotenv").config();
const names = require("./names.json");
const { Random } = require("random-js");

function isRegistered(senderId) {
  return registeredUsers.some((user) => user.userId === senderId);
}

function senderName(senderId) {
  return registeredUsers.find((user) => user.userId === senderId).name;
}

const bot = new Bot(process.env.BOT_API_KEY);
const random = new Random();
const registeredUsers = [];

bot.command("register", async (ctx) => {
  try {
    const newUserId = ctx.message.from.id;
    if (!isRegistered(newUserId)) {
      const randomIndex = random.integer(0, 12);
      const randomName = await names[randomIndex];

      registeredUsers.push({ userId: newUserId, name: randomName });

      const yourNameHeader = senderName(newUserId);
      ctx.reply(`You are now registered. Your name is: ${yourNameHeader}`);

      console.log(registeredUsers);
    } else {
      ctx.reply("You are already registered.");
    }
  } catch (error) {
    console.error("Error registering: ", error.message);
    ctx.reply("Error occured when registering.");
  }
});

bot.on("message", (ctx) => {
  try {
    const senderId = ctx.message.from.id;
    const messageText = ctx.message.text;

    if (isRegistered(senderId)) {
      const senderNameHeader = senderName(senderId);

      registeredUsers.forEach(async (regUser) => {
        if (regUser.userId !== senderId) {
          await bot.api.sendMessage(
            regUser.userId,
            `${senderNameHeader}:\n${messageText}`
          );
        }
      });
    } else {
      ctx.reply("You are not registered. Type /register to register.");
    }
  } catch (error) {
    console.error("Error sending message: ", error.message);
  }
});

bot.on("pinned_message", async (ctx) => {
  try {
    const senderId = ctx.message.from.id;
    const message = ctx.message;
    console.log(message);

    if (isRegistered(senderId)) {
      const senderNameHeader = senderName(senderId);

      registeredUsers.forEach(async (regUser) => {
        if (regUser.userId !== senderId) {
          await bot.api.sendMessage(
            regUser.userId,
            `${senderNameHeader}:\n${message.text}`
          );

          await bot.api.pinChatMessage(senderId);
        }
      });
    } else {
      ctx.reply("You are not registered. Type /register to register.");
    }
  } catch (error) {
    console.error(error.message);
  }
});

bot.start();
