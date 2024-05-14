const { Bot } = require("grammy");
require("dotenv").config();

const { handleStart } = require("./commands/handleStart");
const { handleAllow } = require("./commands/handleAllow");
const { handleTags } = require("./commands/handleTags");

const { handleText } = require("./middleware/handleText");
const { handlePhoto } = require("./middleware/handlePhoto");

const { handleError } = require("./helpers/handleError");

const bot = new Bot(process.env.A24_TEST_BOT_TOKEN);
const adminChatId = parseInt(process.env.ADMIN_ID);

/* Handle /start */
bot.command("start", handleStart);

/* Handle /allow userId,Name command */
bot
  .command("allow")
  .filter((ctx) => ctx.msg.from?.id === adminChatId, handleAllow);

/* Handle /tags Name command */
bot
  .command("tags")
  .filter((ctx) => ctx.msg.from?.id === adminChatId, handleTags);

bot.command("tags", handleTags);

/* Handle sent messages */
bot.on("message:text", handleText);

/* Handle sent photo */
bot.on("message:photo", handlePhoto);

/* Handle errors */
bot.catch(handleError);

bot.start();
