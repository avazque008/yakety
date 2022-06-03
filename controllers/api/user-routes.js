const router = require('express').Router();
const { User } = require('../../models');

// login Route
router.post('/login', (req, res) => {
    // expects {Username: 'lernantino@gmail.com', Password: 'password1234'}
    User.findOne({
        where: {
            Username: req.body.Username
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that username!' });
            return;
        }

        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.Username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});


module.exports = router;