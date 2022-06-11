const router = require('express').Router();
const { response } = require('express');
const { Chat, User } = require('../../models');
const verifyChat = require('../../utils/verify-chat');

// GET A Chat by ID
router.get('/', async (req, res) => {

    let user = await User.GetUser(req.session.user_id);

    user.GetChats().then(dbChatData => {
        if (!dbChatData) {
            res.status(404).json({ message: 'No chat found with this id' });
            return;
        }
        res.json(dbChatData);
    })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


//  CREATE New Chat
// /api/chats/
router.post('/', verifyChat, async (req, res) => {
    let newChat = await Chat.CreateChat([req.session.user_id, req.body.other_user_id], req.body.name)
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

    newChat = await Chat.GetChat(newChat.id);

    const sockets = req.app.get("socketio").engine.clients;

    sendMessages(sockets, newChat.users, "new_chat", { anything: "lovely" });

    res.json(newChat);
});

// ADD Send Message to a Chat
router.post('/:id', async (req, res) => {
    let chat = await Chat.GetChat(req.params.id);

    await chat.AddMessage(req.session.user_id, req.body.message)
        .then(dbChatData => res.json(dbChatData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get Existing Chat
router.get('/:id', async (req, res) => {
    let chat = await Chat.GetChat(req.params.id);

    // DEFINE SKIP AND TAKE!!
    chat.GetMessages(0, 100)
        .then(dbChatData => res.json({ chat: chat, messages: dbChatData }))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

function sendMessages(sockets, users, message_type, message) {
    if (users && sockets) {
        users.forEach(user => {
            sockets.forEach(socket => {
                if (user.id === socket.userID) {
                    socket.emit(message_type, message);
                }
            });
        });
    }
}

module.exports = router;