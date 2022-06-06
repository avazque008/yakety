const router = require('express').Router();
const { Chat, User } = require('../../models');

// GET A Chat by ID
// NEED CLARIFICATION ON WHAT IS NEEDED TO BE PAST ON TO DB
router.get('/', (req, res) => {

    let user = User.GetUser(req.session.user_id);

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
})


//  CREATE New Chat
router.post('/', (req, res) => {
    Chat.CreateChat([req.session.user_id, req.body.user_id], req.body.name)
        .then(dbChatData => res.json(dbChatData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// ADD Send Message to a Chat
router.post('/:id', (req, res) => {
    let chat = Chat.GetChat(req.params.id);

    chat.AddMessage(req.session.user_id, req.body.message)
        .then(dbChatData => res.json(dbChatData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get Existing Chat
router.get('/:id', (req, res) => {
    let chat = Chat.GetChat(req.params.id);

    // DEFINE SKIP AND TAKE!!
    chat.GetMessages(skip, take)
        .then(dbChatData => res.json(dbChatData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET Previuos Chat Messages
router.get('/:chat/skip/:skip/take/:take', (req, res) => {
    let chat = Chat.GetChat(req.params.chat);

    chat.GetMessages(req.params.skip, req.params.take)
        .then(dbChatData => res.json(dbChatData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

module.exports = router;