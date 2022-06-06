const router = require('express').Router();
const { User } = require('../../models');

// GET user by ID
router.get('/:id', async (req, res) => {
    User.GetUser(req.params.id)
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// SEARCH for users
router.post('/search', (req, res) => {
    User.FindUsers(req.body.username)
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



// CREATE/REGISTER a user
router.post('/', (req, res) => {
    User.CreateUser(req.body.username, req.body.password)
        .then(dbUserData => {
            if (dbUserData.user) {
                req.session.save(() => {
                    req.session.user_id = dbUserData.user.id;
                    req.session.username = dbUserData.user.Username;
                    req.session.loggedIn = true;

                    res.json(dbUserData.user);
                });
            } else if (dbUserData.err) {
                // We'll get this if a username is already taken
                // even though this isn't a true DB error.
                // The user just needs to pick a new username.
                res.status(500).json(err);
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


// LogIn Route
router.post('/login', (req, res) => {
    // expects {Username: 'lernantino@gmail.com', Password: 'password1234'}
    User.CheckCredentials(req.body.username, req.body.password)
        .then(dbUserData => {

            if (!dbUserData) {
                res.status(400).json({ message: 'No matching combination of that username and password was found.' });
                return;
            }

            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.Username;
                req.session.loggedIn = true;

                res.json({ message: 'You are now logged in!' });
            });

        })

});

// LogOut Route
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});


module.exports = router;