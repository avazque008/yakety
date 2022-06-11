const router = require('express').Router();
const { Chat, User } = require('../models');

// render Home Page with User Chats
router.get('/', async (req, res) => {
    let user = await User.GetUser(req.session.user_id);

    user.GetChats().then(dbChatData => {
        const chats = dbChatData.map(chat => chat.get({ plain: true }));
        res.render('home-page', { chats, loggedIn: true });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;