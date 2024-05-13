const {
  getRegisteredUsers,
  senderName,
  isRegistered,
  isMissedOrder,
  getHelperFromSheet,
} = require("../helpers/utils");

async function handleText(ctx) {
  /* Pin message */
  if (ctx.message.pinned_message) {
    try {
      const senderId = ctx.message.from.id;
      const pinnedMessage = ctx.message.pinned_message;
      const registeredUsers = loadRegisteredUsers();
      // console.log(pinnedMessage.message_id - 2);

      // try {
      //   await ctx.api.sendMessage(senderId, `${pinnedMessage.message_id - 2}`);
      // } catch (error) {
      //   console.error(error.message);
      // }

      if (isRegistered(registeredUsers, senderId)) {
        let msgIdCounter = 0;
        registeredUsers.map(async (user) => {
          if (user.userId !== senderId) {
            // await ctx.api.pinChatMessage(
            //   user.userId,
            //   `${pinnedMessage.message_id}`
            // );
            await ctx.api.sendMessage(user.userId, `TODO: пін повідомлення`);
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
    const registeredUsers = await getRegisteredUsers();

    /* Check if sender is registered */
    if (isRegistered(registeredUsers, senderId)) {
      const senderNameHeader = senderName(registeredUsers, senderId);

      /* Check if message is a missed order */
      const [isMissed, orderLink] = isMissedOrder(messageText);
      if (isMissed) {
        const helperName = await getHelperFromSheet(orderLink);

        if (helperName) {
          /* Iterate through all users */
          registeredUsers.map(async (user) => {
            if (user.name === helperName) {
              /* Send sender message */
              await ctx.api.sendMessage(
                user.userId,
                `<b>📝 У Вас непрочитанное сообщение по заказу:\n${orderLink}</b>`,
                { parse_mode: "HTML" }
              );
            }
          });
        } else {
          /* Iterate through all users */
          registeredUsers.map(async (user) => {
            if (user.userId !== senderId) {
              /* Send sender message */
              await ctx.api.sendMessage(
                user.userId,
                `<b>❗️ Новое сообщение по заказу:\n${orderLink}\n\nЗанесите номер заказа в таблицу!</b>`,
                { parse_mode: "HTML" }
              );
            }
          });
        }
      } else {
        /* Iterate through all users */
        registeredUsers.map(async (user) => {
          if (user.userId !== senderId) {
            /* Send sender message */
            await ctx.api.sendMessage(
              user.userId,
              `<b>${senderNameHeader}</b>:\n${messageText}`,
              { parse_mode: "HTML" }
            );
          }
        });

        /* Logger */
        console.log(
          `${new Date()} -- User ${senderId} sent a new message: ${messageText}`
        );
      }
    } else {
      await ctx.reply(
        "Вы не зарегистрированы. Отправьте /start, чтобы зарегистрироваться."
      );
    }
  } catch (error) {
    console.error("Error sending message: ", error);
  }
}

module.exports = {
  handleText,
};
