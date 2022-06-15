const router = require('express').Router();
const { response } = require('express');
const { Chat, User } = require('../../models');

// GET A Chat by ID
router.get('/', async(req, res) => {

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
router.post('/', async(req, res) => {
    const chats = await User.GetUser(req.session.user_id).then(user => user.GetChats());
    let newChat = null;

    chats.forEach(chat => {
        let chatUserIds = [];
        chat.users.forEach(user => chatUserIds.push(user.id));

        if (chatUserIds.includes(req.session.user_id) && chatUserIds.includes(+req.body.other_user_id)) {
            newChat = chat;
            return;
        }
    });

    if (newChat == null) {
        newChat = await Chat.CreateChat([req.session.user_id, req.body.other_user_id], req.body.name)
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });

        newChat = await Chat.GetChat(newChat.id);
    }

    const io = req.app.get("socketio");
    const sockets = io.sockets.sockets;
    newChat.users.forEach(user => {
        sockets.forEach(socket => {
            if (socket.userID === user.id) {
                socket.emit("new_chat", newChat);
            }
        });
    });

    await newChat.AddMessage(req.session.user_id, req.body.message)
        .then(dbChatData => {
            const io = req.app.get("socketio");
            const sockets = io.sockets.sockets;
            newChat.users.forEach(user => {
                sockets.forEach(socket => {
                    if (socket.userID === user.id) {
                        socket.emit("receive_message", {
                            chat_id: newChat.id,
                            user_id: req.session.user_id,
                            users: newChat.users,
                            message: dbChatData
                        });
                    }
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });


});

// ADD Send Message to a Chat
router.post('/:id', async(req, res) => {
    let chat = await Chat.GetChat(req.params.id);

    await chat.AddMessage(req.session.user_id, req.body.message)
        .then(dbChatData => {
            const io = req.app.get("socketio");
            const sockets = io.sockets.sockets;
            chat.users.forEach(user => {
                sockets.forEach(socket => {
                    if (socket.userID === user.id) {
                        socket.emit("receive_message", {
                            chat_id: chat.id,
                            user_id: req.session.user_id,
                            users: chat.users,
                            message: dbChatData
                        });
                    }
                });
            });
            //res.json(dbChatData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get Existing Chat
router.get('/:id', async(req, res) => {
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
    if (users && users.length > 0 && sockets && sockets.length > 0) {
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