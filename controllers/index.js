const router = require('express').Router();

const apiRoutes = require('./api/');
const logInRoute = require('./login-route');
const signUpRoute = require('./signup-route');

router.use('/', logInRoute);
router.use('/signup', signUpRoute);
router.use('/api', apiRoutes);

module.exports = router;