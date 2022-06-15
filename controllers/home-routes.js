const router = require('express').Router();

// render Home Page with User Chats\
// Chats will be loaded by the browser
router.get('/', async(req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/");
    }

    res.cookie('user_id', req.session.user_id);
    res.cookie('username', req.session.username);
    //res.send();
    res.render('home-page', { username: req.session.username, user_id: req.session.user_id });
});

module.exports = router;