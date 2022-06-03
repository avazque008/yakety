const express = require('express');
const sequelize = require('./config/connection');
const Synchronize = require('./models');

/*
const routes = require('./controllers');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
 */
async function Start() {
    const rebuild = process.argv.indexOf("--rebuild") < 0 ? false : true;
    const reseedDb = process.argv.indexOf("--seed") < 0 ? false : true;

    await SyncDB(rebuild);

    if (reseedDb) {
        await SeedDB();
    }

    //await StartServer();
}

async function SyncDB(rebuild) {
    Synchronize(rebuild);
}

async function SeedDB() {
    // TBD
    console.log("Database Seeded");
}

async function StartServer() {
    const hbs = exphbs.create({});

    const SequelizeStore = require('connect-session-sequelize')(session.Store);

    const app = express();
    const PORT = process.env.PORT || 3001;

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


    app.listen(PORT, () => console.log(`Now listening at http://localhost:${PORT}/`));
}

Start();