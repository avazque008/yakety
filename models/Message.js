const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');
const Chat = require('./Chat.js');

class Message extends Model {}

Message.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
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
        defaultValue: sequelize.literal("NOW()")
    }
}, {
    hooks: {
        afterCreate: (message, options) => {
            Chat.update({
                LastUsedOn: sequelize.literal("NOW()")
            }, {
                where: {
                    id: message.chat_id
                }
            })
        }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'messages',
});

module.exports = Message;