const { Bot } = require("grammy");
require("dotenv").config();

const { handleStart } = require("./commands/handleStart");

const { handleText } = require("./middleware/handleText");
const { handlePhoto } = require("./middleware/handlePhoto");

const { handleError } = require("./helpers/handleError");

const bot = new Bot(process.env.A24_TEST_BOT_TOKEN);

/* Send /start command */
bot.command("start", handleStart);

/* Send messages */
bot.on("message:text", handleText);

/* Send photos */
bot.on("message:photo", handlePhoto);

/* Handle errors */
bot.catch(handleError);

bot.start();
