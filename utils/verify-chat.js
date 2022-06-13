const { User } = require('../models');

const verifyChat = async (req, res, next) => {
    let user = await User.GetUser(req.session.user_id);

    user.GetChats().then(dbChatData => {
        let chatUser1 = dbChatData.map(chat => chat.users[0].id);
        let chatUser2 = dbChatData.map(chat => chat.users[1].id);

        let usersChat = chatUser1.concat(chatUser2);

        let existChatUser = usersChat.filter(id => id == req.body.other_user_id);

        if (existChatUser[0]) {
            res.json({
                message: 'A chat already exists with that user!'
            })
        } else if (!existChatUser[0]) {
            next();
        }    
    })
};

module.exports = verifyChat;