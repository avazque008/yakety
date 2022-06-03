const sequelize = require("../config/connection");

// import models
const User = require('./User');
const Chat = require('./Chat');
const Chat_Participant = require('./Chat_Participant');
const Message = require('./Message');

User.belongsToMany(Chat, {
    through: Chat_Participant
});

Chat.belongsToMany(User, {
    through: Chat_Participant
});

Chat.hasMany(Message);

async function Synchronize(rebuild) {
    await sequelize.sync({ force: rebuild })
        .then(console.log("Database Synchronized, Rebuild? " + rebuild));
}

module.exports = {
    User,
    Chat,
    Chat_Participant,
    Message,
    Synchronize
}