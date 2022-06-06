const sequelize = require("../config/connection");
const { User, Chat, Message } = require("../models");

const ts = Date.now();

const pass = "no password";

let user1 = null;
let user2 = null;
let user3 = null;

let chat1 = null;
let chat2 = null;

let message1 = null;
let message2 = null;
let message3 = null;

test('User1 creates successfully', async() => {
    user1 = await User.CreateUser(`user1-${ts}`, pass);

    expect(user1).not.toBeNull();
    expect(user1.err).toBeNull();
    expect(user1.user.id).toBeDefined();
    expect(user1.user.id).toBeGreaterThan(0);
    expect(user1.user.Username).toBe(`user1-${ts}`);
});
test('User2 creates successfully', async() => {
    user2 = await User.CreateUser(`user2-${ts}`, pass);

    expect(user2).not.toBeNull();
    expect(user2.err).toBeNull();
    expect(user2.user.id).toBeDefined();
    expect(user2.user.id).toBeGreaterThan(0);
    expect(user2.user.Username).toBe(`user2-${ts}`);
});
test('User3 creates successfully', async() => {
    user3 = await User.CreateUser(`user3-${ts}`, pass);

    expect(user3).not.toBeNull();
    expect(user3.err).toBeNull();
    expect(user3.user.id).toBeDefined();
    expect(user3.user.id).toBeGreaterThan(0);
    expect(user3.user.Username).toBe(`user3-${ts}`);
});

user1, user2, user3 = null;

test('User1 NOT authenticates successfully', async() => {
    user1 = await User.CheckCredentials(`user1-${ts}`, "wrong password");

    expect(user1).toBeNull();
});

test('User1 authenticates successfully', async() => {
    user1 = await User.CheckCredentials(`user1-${ts}`, pass);

    expect(user1).not.toBeNull();
    expect(user1.id).toBeDefined();
    expect(user1.id).toBeGreaterThan(0);
    expect(user1.Username).toBe(`user1-${ts}`);
});
test('User2 authenticates successfully', async() => {
    user2 = await User.CheckCredentials(`user2-${ts}`, pass);

    expect(user2).not.toBeNull();
    expect(user2.id).toBeDefined();
    expect(user2.id).toBeGreaterThan(0);
    expect(user2.Username).toBe(`user2-${ts}`);
});
test('User3 authenticates successfully', async() => {
    user3 = await User.CheckCredentials(`user3-${ts}`, pass);

    expect(user3).not.toBeNull();
    expect(user3.id).toBeDefined();
    expect(user3.id).toBeGreaterThan(0);
    expect(user3.Username).toBe(`user3-${ts}`);
});

test('Chat User1 User2 Creates', async() => {
    chat1 = await Chat.CreateChat([user1.id, user2.id], "User1 User2");

    expect(chat1).not.toBeNull();
    expect(chat1.id).toBeDefined();
    expect(chat1.id).toBeGreaterThan(0);
});

test('Chat User2 User3 Creates', async() => {
    chat2 = await Chat.CreateChat([user2.id, user3.id], "User2 User3");

    expect(chat2).not.toBeNull();
    expect(chat2.id).toBeDefined();
    expect(chat2.id).toBeGreaterThan(0);
});

test('User1 has 1 chat', async() => {
    const user1chats = await user1.GetChats();

    expect(user1chats).not.toBeNull();
    expect(user1chats.length).toBe(1);
});
test('User2 has 2 chats', async() => {
    const user2chats = await user2.GetChats();

    expect(user2chats).not.toBeNull();
    expect(user2chats.length).toBe(2);
});
test('User3 has 1 chat', async() => {
    const user3chats = await user3.GetChats();

    expect(user3chats).not.toBeNull();
    expect(user3chats.length).toBe(1);
});

test('Ensure chat1 messages deliver properly', async() => {
    await chat1.AddMessage(user1.id, "Chat 1 Sender 1 Message 1");
    await chat1.AddMessage(user2.id, "Chat 1 Sender 2 Message 2");
    await chat1.AddMessage(user1.id, "Chat 1 Sender 1 Message 3");

    let messages = await chat1.GetMessages(0, 10);
    expect(messages).not.toBeNull();
    expect(messages.length).toBe(3);
});

test('Ensure chat2 messages deliver properly', async() => {
    await chat2.AddMessage(user2.id, "Chat 2 Sender 2 Message 1");
    await chat2.AddMessage(user3.id, "Chat 2 Sender 3 Message 2");
    await chat2.AddMessage(user2.id, "Chat 2 Sender 2 Message 3");

    let messages = await chat2.GetMessages(0, 10);
    expect(messages).not.toBeNull();
    expect(messages.length).toBe(3);
});