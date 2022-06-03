const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Chat_Participant extends Model {}

Chat_Participant.init({
    // Columns will be defined automatically my sequelize
}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'chat_participants',
});

module.exports = Chat_Participant;