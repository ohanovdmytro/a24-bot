const {
  getRegisteredUsers,
  senderName,
  isRegistered,
  hasOrderLink,
  getHelperFromSheet,
  hasTags,
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

      /* Check if message has a link order */
      const [hasLink, orderLink] = hasOrderLink(messageText);

      if (hasLink) {
        const [hasHelper, helperName] = await getHelperFromSheet(orderLink);
        const [isTag, usersWithTags] = hasTags(messageText, registeredUsers);
        console.log(hasHelper, isTag);
        if (hasHelper) {
          /* Iterate through all users - HELPER_SEND */
          registeredUsers.map(async (user) => {
            if (user.name === helperName) {
              /* Send sender message */
              await ctx.api.sendMessage(
                user.userId,
                `<b>❗️ Пишуть по замовленню у роботі:\n\n${messageText}</b>`,
                { parse_mode: "HTML" }
              );
            }
          });

          /* Logger */
          console.log(
            `${new Date()} -- User ${senderId} sent a HELPER_MESSAGE: ${messageText}`
          );
        } else if (!hasHelper && isTag) {
          /* Iterate through all users with tags -- TAGS_SEND */
          usersWithTags.map(async (user) => {
            if (user.userId !== senderId) {
              /* Send sender message */
              await ctx.api.sendMessage(
                user.userId,
                `<b>${senderNameHeader}:</b>\n${messageText}`,
                { parse_mode: "HTML" }
              );
            }
          });

          /* Logger */
          console.log(
            `${new Date()} -- User ${senderId} sent a TAGS_MESSAGE: ${messageText}`
          );
        } else {
          /* Iterate through all users -- HELPER_SEND_ALL */
          registeredUsers.map(async (user) => {
            if (user.userId !== senderId) {
              /* Send sender message */
              await ctx.api.sendMessage(
                user.userId,
                `<b>📝 Повідомлення про замовлення: </b>\n\n<b>${senderNameHeader}:</b>\n${messageText}`,
                { parse_mode: "HTML" }
              );
            }
          });
        }
      } else {
        /* Iterate through all users wich has -- SEND_ALL */
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
        "Ви не зареєстровані. Відпарвте /start, щоб зареєструватись."
      );
    }
  } catch (error) {
    console.error("Error sending message: ", error);
  }
}

module.exports = {
  handleText,
};
