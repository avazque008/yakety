const sequelize = require('../config/connection');
const { User, Chat, Message } = require('../models');

const UserCount = 10;
const ChatsPerUser = 5;
const MessagesPerChat = 20;

const seedAll = async() => {

    await sequelize.sync({ force: true });

    console.log("Seeding Users");

    const users = [];
    for (i = 0; i < UserCount; i++) {
        users.push(await User.CreateUser(
            `User${i}`,
            "no password"));
    }

    console.log("Seeding Chats");

    const chats = []
    for (i = 0; i < users.length - 1; i += 2) {
        for (j = 0; j < ChatsPerUser; j++) {
            chats.push(await Chat.CreateChat(
                [users[i].user.id, users[i + 1].user.id],
                `Chat ${j}`));
        }
    }

    for (i = 0; i < chats.length; i++) {
        chats[i] = await Chat.GetChat(chats[i].id);
    }

    console.log("Seeding Messages");

    for (i = 0; i < chats.length; i++) {
        for (j = 0; j < MessagesPerChat; j++) {
            const senderUser = j % 2;
            await chats[i].AddMessage(
                chats[i].users[senderUser].id,
                `Chat ${i} - Message ${j}`
            );
        }
    }


    process.exit(0);
};

seedAll();