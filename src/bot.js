const { Bot } = require("grammy");
require("dotenv").config();
const names = require("../storage/names.json");
const { Random } = require("random-js");
const {
  loadRegisteredUsers,
  saveRegisteredUsers,
  senderName,
  isRegistered,
} = require("./utils");

const bot = new Bot(process.env.BOT_API_KEY);
const random = new Random();

bot.command("start", async (ctx) => {
  try {
    const newUserId = ctx.message.from.id;
    const newUsername = ctx.message.from.username;
    const registeredUsers = loadRegisteredUsers();

    if (!isRegistered(registeredUsers, newUserId)) {
      const randomIndex = random.integer(0, 12);
      const randomName = await names[randomIndex];

      registeredUsers.push({
        userId: newUserId,
        username: newUsername,
        name: randomName,
      });
      saveRegisteredUsers(registeredUsers);

      const yourNameHeader = senderName(registeredUsers, newUserId);
      ctx.reply(`You are now registered. Your name is: ${yourNameHeader}`);

      console.log(registeredUsers);
    } else {
      ctx.reply("You are already registered.");
    }
  } catch (error) {
    console.error("Error registering: ", error.message);
    ctx.reply("Error occurred when registering.");
  }
});

bot.on("message", async (ctx) => {
  console.log(ctx.message);

  if (typeof ctx.message.pinned_message === "object") {
    const senderId = ctx.message.from.id;
    const pinnedMessage = ctx.message.pinned_message;
    const registeredUsers = loadRegisteredUsers();

    if (isRegistered(registeredUsers, senderId)) {
      let msgIdCounter = 0;
      registeredUsers.map(async (user) => {
        if (user.userId !== senderId) {
          // await bot.api.pinChatMessage(
          //   user.userId,
          //   `${pinnedMessage.message_id}`
          // );
          await bot.api.sendMessage(user.userId, `TODO: pin message for user`);
        }
      });
    }
    return;
  }

  const senderId = ctx.message.from.id;
  const messageText = ctx.message.text;

  try {
    const registeredUsers = loadRegisteredUsers();

    if (isRegistered(registeredUsers, senderId)) {
      const senderNameHeader = senderName(registeredUsers, senderId);

      registeredUsers.map(async (user) => {
        if (user.userId !== senderId) {
          await bot.api.sendMessage(
            user.userId,
            `${senderNameHeader}:\n${messageText}`
          );
        }
      });
    } else {
      ctx.reply("You are not registered. Type /start to register.");
    }
  } catch (error) {
    console.error("Error sending message: ", error.message);
  }
});

bot.start();
