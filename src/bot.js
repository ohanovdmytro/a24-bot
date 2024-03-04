const { Bot, HttpError, GrammyError } = require("grammy");
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
      await ctx.reply(`Ви зареєстровані, Ваше ім'я: ${yourNameHeader}`);

      console.log(registeredUsers);
    } else {
      await ctx.reply("Ви вже зареєстровані.");
    }
  } catch (error) {
    console.error("Error registering: ", error.message);
    await ctx.reply("Error occurred when registering.");
  }
});

bot.on("message:text", async (ctx) => {
  if (ctx.message.pinned_message) {
    try {
      const senderId = ctx.message.from.id;
      const pinnedMessage = ctx.message.pinned_message;
      const registeredUsers = loadRegisteredUsers();
      // console.log(pinnedMessage.message_id - 2);

      // try {
      //   await bot.api.sendMessage(senderId, `${pinnedMessage.message_id - 2}`);
      // } catch (error) {
      //   console.error(error.message);
      // }

      if (isRegistered(registeredUsers, senderId)) {
        let msgIdCounter = 0;
        registeredUsers.map(async (user) => {
          if (user.userId !== senderId) {
            // await bot.api.pinChatMessage(
            //   user.userId,
            //   `${pinnedMessage.message_id}`
            // );
            await bot.api.sendMessage(user.userId, `TODO: пін повідомлення`);
          }
        });
      }
      return;
    } catch (error) {
      console.error(error.message);
    }
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
            `<b>${senderNameHeader}</b>:\n${messageText}`,
            { parse_mode: "HTML" }
          );
        }
      });
    } else {
      await ctx.reply(
        "Ви не зареєстровані. Надішліть /start щоб зареєструватись."
      );
    }
  } catch (error) {
    console.error("Error sending message: ", error.message);
  }
});

bot.on("message:photo", async (ctx) => {
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
          await bot.api.sendMessage(user.userId, `TODO: запінити фото`);
        }
      });
    }
    return;
  }

  const senderId = ctx.message.from.id;
  const photosArray = ctx.message.photo;
  const photo = photosArray.slice(-1);
  const photoId = photo[0].file_id;

  try {
    const registeredUsers = loadRegisteredUsers();

    if (isRegistered(registeredUsers, senderId)) {
      const senderNameHeader = senderName(registeredUsers, senderId);

      registeredUsers.map(async (user) => {
        if (user.userId !== senderId) {
          await bot.api.sendPhoto(user.userId, photoId, {
            caption: `<b>${senderNameHeader}:</b>`,
            parse_mode: "HTML",
          });
        }
      });
    } else {
      ctx.reply("Ви не зареєстровані. Надішліть /start щоб зареєструватись.");
    }
  } catch (error) {
    console.error("Error sending message: ", error.message);
  }
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();
