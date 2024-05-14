module.exports = {
  apps: [
    {
      name: "a24-bot",
      script: "src/bot.js",
      env: {
        NODE_ENV: "production",
        A24_BOT_TOKEN: "7176227983:AAFT2vb9hF4ON89Cvl-APigmrZFaAwxouO0",
        ADMIN_ID: "5609072359",
        SHEET_ID: "1TU8gtJ2ACZkZghMbCu1qK8s1TgRidIavGzaCMw8g1T0",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
