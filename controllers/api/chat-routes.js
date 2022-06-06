const router = require('express').Router();
const { Chat, User } = require('../../models');

// GET A Chat by ID
// NEED CLARIFICATION ON WHAT IS NEEDED TO BE PAST ON TO DB
router.get('/:id', async (req, res) => {

    let user = await User.GetUser(req.session.user_id || req.params.id);

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
router.post('/', async (req, res) => {
    await Chat.CreateChat([req.session.user_id || req.body.session_id, req.body.user_id], req.body.name)
        .then(dbChatData => res.json(dbChatData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// ADD Send Message to a Chat
router.post('/:id', async (req, res) => {
    let chat = await Chat.GetChat(req.params.id);

    chat.AddMessage(req.session.user_id || req.body.session_id, req.body.message)
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
        .then(dbChatData => res.json(dbChatData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// // GET Previuos Chat Messages
// router.get('/:chat/skip/:skip/take/:take', (req, res) => {
//     let chat = Chat.GetChat(req.params.chat);

//     chat.GetMessages(0, 100)
//         .then(dbChatData => res.json(dbChatData))
//         .catch(err => {
//             console.log(err);
//             res.status(500).json(err);
//         });

// });

module.exports = router;