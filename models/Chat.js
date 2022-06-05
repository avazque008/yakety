const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class Chat extends Model {
    static async CreateChat(userIds, name) {
        const newChat = await Chat.create({
            Name: name
        });

        await newChat.setUsers(userIds);

        return newChat;
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
        defaultValue: sequelize.literal("NOW()")
    },
    LastUsedOn: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("NOW()")
    },

}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'chats',
});

module.exports = Chat;