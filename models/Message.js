const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');
const Chat = require('./Chat.js');

class Message extends Model {}

Message.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Text: {
        type: DataTypes.STRING
    },
    SentOn: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'messages',
});

module.exports = Message;