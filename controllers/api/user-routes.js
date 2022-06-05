const router = require('express').Router();
const { User } = require('../../models');
const { Op } = require('sequelize');

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
        Password: req.body.password
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
    User.findOne({
        where: {
            Username: req.body.username
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