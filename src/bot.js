const { Bot } = require("grammy");
require("dotenv").config();

const { handleStart } = require("./commands/handleStart");
const { handleAllow } = require("./commands/handleAllow");

const { handleText } = require("./middleware/handleText");
const { handlePhoto } = require("./middleware/handlePhoto");

const { handleError } = require("./helpers/handleError");

const bot = new Bot(process.env.A24_TEST_BOT_TOKEN);

/* Handle /start */
bot.command("start", handleStart);

/* Handle /allow userId,Name command */
bot.command("allow", handleAllow);

/* Handle sent messages */
bot.on("message:text", handleText);

/* Handle sent photo */
bot.on("message:photo", handlePhoto);

/* Handle errors */
bot.catch(handleError);

bot.start();
