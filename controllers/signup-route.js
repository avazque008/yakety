const router = require('express').Router();

// render LogIn page
router.get('/', (req, res) => {
    res.render('signup-page');
});

module.exports = router;