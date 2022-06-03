const sequelize = require("./config/connection");
const { Op } = require("sequelize");
const { User, Chat, Message, Synchronize } = require("./models");

function write(obj) {
    console.log(JSON.stringify(obj, null, 2));
}

async function RunDemo() {
    await Synchronize(true);

    // Creating one existing user
    let upper = "Steve".toUpperCase();
    await User.create({
        Username: "Steve",
        UsernameNormalized: upper,
        Password: "We should really store hashes, not passwords"
    });

    // User registers
    upper = "Jane".toUpperCase();
    let newUser = await User.create({
        Username: "Jane",
        UsernameNormalized: upper,
        Password: "We should really store hashes, not passwords"
    });

    // User searches for someone to send a message to
    upper = "Ste".toUpperCase();
    let userSearch = await User.findAll({
        where: {
            UsernameNormalized: {
                [Op.like]: upper.concat('%')
            }
        },
        order: ["Username"]
    });

    write(userSearch)

    // A user is selected from the search result, so...
    // Create a new chat
    let newChat = await Chat.create()
        // Look up the found user
    let foundUser = await User.findOne({
        where: {
            id: userSearch[0].id
        }
    });

    // Add the current and found users to the chat
    await newChat.setUsers([newUser.id, foundUser.id]);

    // Return the new chat
    write(newChat);

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
            include: User,
            attributes: ["id"]
        })
        // Send that message to all of those users via socket.io
    write(chat1userIds);

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
    write(loginUser);

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

    write(messages);


}

RunDemo();