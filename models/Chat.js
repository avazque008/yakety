const { Model, DataTypes } = require('sequelize');
const User = require("./User");
const Message = require("./Message");

const sequelize = require('../config/connection');

class Chat extends Model {
    static async CreateChat(userIds, name) {
        const newChat = await Chat.create({
            Name: name
        });

        await newChat.setUsers(userIds);

        return newChat;
    }

    static async GetChat(id) {
        const foundChat = await Chat.findOne({
            where: {
                id: id
            },
            include: [{
                model: User,
                attributes: ["id", "Username"]
            }]
        });

        return foundChat;
    }

    async AddMessage(senderId, message) {
        let newMessage = await Message.create({
            user_id: senderId,
            chat_id: this.id,
            Text: message
        });

        this.LastUsedOn = newMessage.SentOn;
        this.save();
    }

    async GetMessages(skip, take) {
        const messages = await Message.findAll({
            where: {
                chat_id: this.id
            },
            order: [
                ['SentOn', "DESC"]
            ],
            offset: skip,
            limit: take
        });

        return messages;
    }
}

Chat.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    CreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    LastUsedOn: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },

}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'chats',
});

module.exports = Chat;