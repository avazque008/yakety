const router = require('express').Router();

// render LogIn page
router.get('/', (req, res) => {
    const userName = req.session.username;
    res.render('home-page', {
        loggedIn: true,
        username: userName
    });
});

module.exports = router;