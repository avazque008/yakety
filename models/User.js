const { Model, DataTypes, Op } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = require('../config/connection');

class User extends Model {

    static async CreateUser(username, password) {
        var pwdHash = await bcrypt.hash(password, 10);
        try {
            const newUser = await User.create({
                Username: username,
                UsernameNormalized: username.toUpperCase(),
                Password: pwdHash
            });

            return { user: newUser, err: null };
        } catch (err) {
            if (err && err.original.code == "ER_DUP_ENTRY") {
                return { user: null, err: "Username is taken." };
            }
            return { user: null, err: err.original.code };
        }
    }

    static async CheckCredentials(username, password) {
        const authResult = await User.findOne(({
            where: {
                UsernameNormalized: username.toUpperCase()
            }
        })).then(dbUserData => {
            if (!dbUserData) {
                return null;
            }
            if (bcrypt.compare(password, dbUserData.Password)) {
                return dbUserData;
            }

            return null;
        });

        return authResult;
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
                attributes: ["id", "Username"],
                through: {
                    attributes: []
                }
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
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'users'
});

module.exports = User;