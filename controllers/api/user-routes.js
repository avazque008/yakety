const router = require('express').Router();
const { User } = require('../../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

// SEARCH for users
router.post('/search', (req, res) => {
    User.findAll({
            where: {
                UsernameNormalized: {
                    [Op.like]: req.body.username.toUpperCase()
                }
            },
            order: ["Username"]
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this username' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});



// CREATE a user
router.post('/', (req, res) => {
    User.create({
            Username: req.body.username,
            UsernameNormalized: req.body.username.toUpperCase(),
            Password: bcrypt.hashSync(req.body.password, 1000)
        })
        .then(dbUserData => {
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.Username;
                req.session.loggedIn = true;

                res.json(dbUserData);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


// LogIn Route
router.post('/login', (req, res) => {
    // expects {Username: 'lernantino@gmail.com', Password: 'password1234'}
    User.checkCredentials(req.body.username, bcrypt(req.body.password, 1000), req.session.save((userid, username) => {
        req.session.user_id = userid;
        req.session.username = username;
        req.session.loggedIn = true;

        res.json({ user: dbUserData, message: 'You are now logged in!' });
    }));
});

router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});


module.exports = router;