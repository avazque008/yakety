const { Model, DataTypes, Op } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = require('../config/connection');

class User extends Model {

    static async CreateUser(username, password) {
        try {
            const newUser = await User.create({
                Username: username,
                UsernameNormalized: username.toUpperCase(),
                Password: password
            });

            return { user: newUser, err: null };
        } catch (err) {
            if (err && err.original.code == "ER_DUP_ENTRY") {
                return { user: null, err: "Username is taken." };
            }
            return { user: null, err: err.original.code };
        }
    }

    static async checkCredentials(username, password) {
        const pwHash = await bcrypt.hash(password, 10)
        await User.findOne(({
            where: {
                UsernameNormalized: username.toUpperCase(),
                Password: pwHash
            }
        })).then(dbUserData => {
            if (!dbUserData) {
                res.status(400).json({ message: 'No matching combination of that username and password was found.' });
                return;
            }

            return (dbUserData.id, dbUserData.Username);
        });
    }

    static async FindUsers(username) {
        let userSearch = await User.findAll({
            where: {
                UsernameNormalized: {
                    [Op.like]: username.toUpperCase().concat('%')
                }
            },
            attributes: ["id", "Username"],
            order: ["Username"],
            limit: 5
        });

        return userSearch;
    }

    async GetChats() {
        const chats = await this.getChats({
            include: [{
                model: User,
                attributes: ["id", "Username"]
            }]
        });

        return chats;
    }
}


User.init({
    // define columns
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    UsernameNormalized: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    hooks: {
        // set up beforeCreate lifecycle "hook" functionality
        async beforeCreate(newUserData) {
            newUserData.password = await bcrypt.hash(newUserData.Password, 10);
            return newUserData;
        },

        async beforeUpdate(updatedUserData) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.Password, 10);
            return updatedUserData;
        }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'users'
});

module.exports = User;