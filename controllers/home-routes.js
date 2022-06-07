const router = require('express').Router();

// render LogIn page
router.get('/', (req, res) => {
    res.render('home-page');
});

module.exports = router;