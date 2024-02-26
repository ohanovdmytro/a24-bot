const { Bot } = require("grammy");
require("dotenv").config();
const names = require("./names.json");
const { Random } = require("random-js");

const bot = new Bot(process.env.BOT_API_KEY);
const random = new Random();
const registeredUsers = [];

bot.command("register", async (ctx) => {
  try {
    const newUserId = ctx.message.from.id;
    if (!registeredUsers.some((user) => user.userId === newUserId)) {
      const randomIndex = random.integer(0, 12);
      const randomName = await names[randomIndex];

      registeredUsers.push({ userId: newUserId, name: randomName });

      const yourName = registeredUsers.find(
        (user) => user.userId === newUserId
      ).name;
      ctx.reply(`You are now registered. Your name is: ${yourName}`);

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

    if (registeredUsers.some((user) => user.userId === senderId)) {
      const senderName = registeredUsers.find(
        (user) => user.userId === senderId
      ).name;

      registeredUsers.forEach(async (regUser) => {
        if (regUser.userId !== senderId) {
          await bot.api.sendMessage(
            regUser.userId,
            `${senderName}:\n${messageText}`
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

bot.start();
