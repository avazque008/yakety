const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class User extends Model {
    // set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.Password);
    }

    static async checkCredentials(username) {
        await User.findOne(({
            where: {
                UsernameNormalized: username.toUpperCase(),
            }
        })).then(dbUserData => {
            if (!dbUserData) {
                res.status(400).json({ message: 'No matching combination of that username and password was found.' });
                return;
            }

            return (dbUserData);
        });
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
            newUserData.Password = await bcrypt.hash(newUserData.Password, 10);
            return newUserData;
        }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'users'
});

module.exports = User;