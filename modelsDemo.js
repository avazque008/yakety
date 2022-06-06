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
    const newChat = await Chat.CreateChat([userSteve.id, userSearch[0].id], "optional chat title");

    write("New chat", newChat);

    const foundChat = await Chat.GetChat(newChat.id);

    write("Found (new) chat", foundChat);

    // Return the new chat
    write("New chat results", foundChat);

    // Get all chats associated with a user
    const steveChats = await userSteve.GetChats();
    write("Get chats for steve result", steveChats);

    // Get all chats associated with a user
    const janeChats = await userJane.GetChats();
    write("Get chats for Jane result", janeChats);

    // Get all chats associated with a user
    const maryChats = await userMary.GetChats();
    write("Get chats for mary result", maryChats);

    // newUser sends a message to foundUser
    await steveChats[0].AddMessage(userSteve.id, "Message 1");
    write("Steve message added", null);

    // They send several additional messages back and forth
    // this uses the DB model rather than the addmessage for speed
    // and is not intended to be used by consumers of the model.
    write("Adding several messages", null);
    await Message.bulkCreate([
        { user_id: userSearch[0].id, chat_id: foundChat.id, Text: "Message 2" },
        { user_id: userSteve.id, chat_id: foundChat.id, Text: "Message 3" },
        { user_id: userSearch[0].id, chat_id: foundChat.id, Text: "Message 4" },
        { user_id: userSteve.id, chat_id: foundChat.id, Text: "Message 5" },
        { user_id: userSearch[0].id, chat_id: foundChat.id, Text: "Message 6" },
        { user_id: userSteve.id, chat_id: foundChat.id, Text: "Message 7" },
        { user_id: userSearch[0].id, chat_id: foundChat.id, Text: "Message 8" },
        { user_id: userSteve.id, chat_id: foundChat.id, Text: "Message 9" }
    ]);


    // USER LOGIN

    // Verify the username and password
    // If either are wrong, zero results will be returned.
    // If they're right, one result with all of the user's chats
    // will be returned (saves a database call)
    // Be sure to normalize and use the normalized field
    const newUserSteve = await User.CheckCredentials("Steve", "no password");
    const newUserMary = await User.CheckCredentials("Mary", "no password");

    write("Login Steve including chats", newUserSteve);
    write("Login Mary including chats", newUserMary);

    const newSteveChats = await newUserSteve.GetChats();
    const newMaryChats = await newUserMary.GetChats();
    write("Steve chats", newSteveChats);
    write("Mary chats", newMaryChats);

    // User selects a chat so find the latest messages by chat ID
    // Note that we don't want to return ALL messages because
    // there could be millions, so note the page and offset settings
    let steveMessages = await newSteveChats[0].GetMessages(2, 3);


    write("Get messages for steve", steveMessages);


}

RunDemo(process.argv.includes("--rebuild"));