const router = require('express').Router();

const apiRoutes = require('./api/');
const logInRoute = require('./login-route');

router.use('/', logInRoute);
router.use('/api', apiRoutes);

module.exports = router;