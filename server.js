const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const http = require('http')
const session = require('express-session');
var cookieParser = require('cookie-parser');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const { Server } = require("socket.io");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

// turn on routes
app.use(routes);
app.use(cookieParser());
const server = http.createServer(app);
const io = new Server(server);

app.set("socketio", io);

io.on('connection', (socket) => {
    socket.emit("client_id", socket.client.id);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    server.listen(PORT, () => {
        console.log(`Now listening at http://localhost:${PORT}/`);
    });
});