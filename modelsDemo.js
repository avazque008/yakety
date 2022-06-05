const sequelize = require("./config/connection");
const { Op } = require("sequelize");
const { User, Chat, Message, Synchronize } = require("./models");
const { use } = require("bcrypt/promises");

function write(message, obj) {
    console.log('\x1b[31m%s\x1b[0m', message);
    console.log(JSON.stringify(obj, null, 2));
}

async function RunDemo(forceRecreate) {
    await Synchronize(forceRecreate);

    // User 1 registers
    const userSteve = await User.CreateUser("Steve", "no password")
        .then(response => {
            if (response.user) {
                return response.user;
            } else {
                write("Error", response.err);
                return null;
            }
        });

    // User 2 registers
    const userJane = await User.CreateUser("Jane", "no password")
        .then(response => {
            if (response.user) {
                return response.user;
            } else {
                write("Error", response.err);
                return null;
            }
        });

    // User 3 registers
    const userMary = await User.CreateUser("Mary", "no password")
        .then(response => {
            if (response.user) {
                return response.user;
            } else {
                write("Error", response.err);
                return null;
            }
        });

    // User searches for someone to send a message to
    let userSearch = await User.FindUsers("Ma");

    write("User search results", userSearch)

    // A user is selected from the search result, so...
    // Create a new chat
    let newChat = await Chat.CreateChat([userSteve.id, userSearch[0].id], "optional chat title");

    // Add the current and found users to the chat
    await newChat.setUsers([newUser.id, foundUser.id]);

    newChat = await Chat.findOne({
        where: {
            id: newChat.id
        },
        include: User
    });

    // Return the new chat
    write("New chat results", newChat);

    // Get all chats associated with a user
    const userChats = await newUser.GetChats();
    write("Get chats for a user result", userChats);

    // newUser sends a message to foundUser
    let message1 = await Message.create({
        user_id: newUser.id,
        chat_id: newChat.id,
        Text: "Message 1"
    });

    // They send several additional messages back and forth
    await Message.bulkCreate([
        { user_id: foundUser.id, chat_id: newChat.id, Text: "Message 2" },
        { user_id: newUser.id, chat_id: newChat.id, Text: "Message 3" },
        { user_id: foundUser.id, chat_id: newChat.id, Text: "Message 4" },
        { user_id: newUser.id, chat_id: newChat.id, Text: "Message 5" },
        { user_id: foundUser.id, chat_id: newChat.id, Text: "Message 6" },
        { user_id: newUser.id, chat_id: newChat.id, Text: "Message 7" },
        { user_id: foundUser.id, chat_id: newChat.id, Text: "Message 8" },
        { user_id: newUser.id, chat_id: newChat.id, Text: "Message 9" }
    ]);

    // Find all participants in the chat related to the message
    let chat1userIds = await Chat.findByPk(message1.chat_id, {
        where: {
            id: message1.chat_id
        },
        include: [{
            model: User,
            as: "users",
            attributes: ["id", "Username"],
            through: {
                attributes: []
            }
        }]
    });
    // Send that message to all of those users via socket.io
    write("Find chat including user IDs", chat1userIds);

    // USER LEAVES

    // USER LOGIN

    // Verify the username and password
    // If either are wrong, zero results will be returned.
    // If they're right, one result with all of the user's chats
    // will be returned (saves a database call)
    // Be sure to normalize and use the normalized field
    upper = "Steve".toUpperCase();
    let loginUser = await User.findOne({
        where: {
            Username: upper,
            Password: "We should really store hashes, not passwords"
        },
        include: Chat
    });
    write("Login Steve including chats", loginUser);

    // User selects a chat so find the latest messages by chat ID
    // Note that we don't want to return ALL messages because
    // there could be millions, so note the page and offset settings
    let messages = await Message.findAll({
        where: {
            chat_id: 1
        },
        order: [
            ['SentOn', "DESC"]
        ],
        offset: 3,
        limit: 5
    });

    write("Get messages for chat", messages);


}

RunDemo(process.argv.includes("--rebuild"));