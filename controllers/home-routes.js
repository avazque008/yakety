const router = require('express').Router();
const { Chat, User } = require('../models');

// render Home Page with User Chats
router.get('/', async (req, res) => {
    console.log(req.session)
    let user = await User.GetUser(req.session.user_id);
    console.log(user)

    user.GetChats().then(dbChatData => {
        const chats = dbChatData.map(chat => chat.get({ plain: true }));
        // res.render('home-page', { chats, loggedIn: true });
        res.sendFile(__dirname + '/index.html')
    })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;