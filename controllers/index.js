const router = require('express').Router();

const apiRoutes = require('./api');
const logInRoute = require('./login-route');
const homeRoutes = require('./home-routes');

router.use('/', logInRoute);
router.use('/api', apiRoutes);
router.use('/home', homeRoutes);

module.exports = router;