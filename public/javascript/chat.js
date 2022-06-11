$("#chatsList").on("click", "li", event => {
    let chatLi = $(event.currentTarget);
    openChat(chatLi.attr("chat-id"));
    $("#chatsList > li").removeClass("bg-primary");
    chatLi.addClass("bg-primary");
});

$("#foundUsers").on("click", "li", event => {
    let target_user_id = $(event.currentTarget).attr("user_id");
    let target_username = $(event.currentTarget).text();
    $("#newMessageModal").show();
    $("#newMessageText").attr("user_id", target_user_id);
    $("#newChatModalTitle").text(`New message to ${target_username}`);

})

$(".btn-close").on("click", event => {
    $("#newMessageModal").hide();
})

$("#sendNewChat").on("click", async event => {

    $("#foundUsers").empty();
    $("#newMessageModal").hide();
    let message = $("#newMessageText").val();
    let target_user_id = $("#newMessageText").attr("user_id");
    let newChat = {
        other_user_id: target_user_id,
        name: ""
    }

    let newChatResponse = await post('/api/chats', newChat);
    console.log(newChatResponse);
    if (!newChatResponse) {
        alert("Your new chat was not created successfully.");
        return;
    }

    let newChatId = newChatResponse.id;

    let messageResponse = await post(`/api/chats/${newChatId}`, { message: message });

    console.log(messageResponse);

})

$("#findUser").on("keyup", async event => {
    let query = event.currentTarget.value;
    if (query.length > 0) {
        let found = await get(`/api/users?search=${query}`);
        let foundUsersUl = $("#foundUsers");

        foundUsersUl.empty();

        found.forEach(user => {
            console.log(user);
            var userLi = $("<li>");
            userLi.text(user.Username);
            userLi.attr("user_id", user.id);
            foundUsersUl.append(userLi);
        });
    }
});

$("#sendMessage").on("click", async event => {
    let chat_id = $(event.currentTarget).attr("chat-id");
    let message = $("#messageContent").val();

    await post(`/api/chats/${chat_id}`, { message: message });
})



async function registerSocket(stream_session_id) {
    console.log("Registering streaming session");
    console.log(stream_session_id);
    const user_id = Cookies.get("user_id");
    let resp = await put(`/api/users/${user_id}`, {
        stream_session_id: stream_session_id
    });
    console.log(resp);
    if (!resp.ok) {
        console.log("Streaming session failed to register");
    }

}

async function receiveMessage(msg) {

}

async function newChat(chat) {
    console.log(chat);
    loadChat(chat);
}

async function openChat(chat_id) {
    const user_id = Cookies.get("user_id");

    let chat = await get(`/api/chats/${chat_id}`);

    $("#sendMessage").attr("chat-id", chat_id);

    let users = chat.chat.users;

    $("#messages").empty();

    chat.messages.forEach(async message => {
        await displayMessage(user_id, users, message);
    });
}

async function displayMessage(user_id, users, message) {
    let nameDiv = $("<div>");
    if (message.user_id == user_id) {
        nameDiv.addClass(["col-3", "bg-secondary", "text-white", "m-2"]);
    } else {

        nameDiv.addClass(["col-3", "bg-primary", "text-white", "m-2"]);
    }

    let user = getUser(users, message.user_id);

    nameDiv.html(user.Username);

    let textDiv = $("<div>");
    textDiv.addClass("col");
    textDiv.html(message.Text);
    let rowDiv = $("<div>");
    rowDiv.addClass(["row", "m-2"]);
    rowDiv.append(nameDiv);
    rowDiv.append(textDiv);

    let msgsDiv = $("#messages");
    msgsDiv.append(rowDiv);

    msgsDiv.scrollTop();

}

async function loadChats() {

    const chats = await get('/api/chats');


    chats.forEach(chat => loadChat(chat));
}

async function loadChat(chat) {
    const user_id = Cookies.get("user_id");
    let headerHtml = "";
    if (chat.name) {
        headerHtml.append(`<h3>${chat.name}</h3>`);
    }

    chat.users.forEach(user => {
        if (user.id != user_id) {
            headerHtml = headerHtml.concat(`<p>${user.Username}</p>`);
        }
    });

    let newLi = $("<li>").html(headerHtml);

    newLi.attr("chat-id", chat.id);

    $("#chatsList").append(newLi);
}

async function get(url) {
    return await fetch(url)
        .then(response => {
            if (!response.ok) {
                alert('An error occurred performing your request');
                return;
            }
            return response.json()
                .then(data => {
                    return data;
                })
        })
}

async function post(url, data) {
    let resp = await fetch(url, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!resp.ok) {
        alert('An error occurred performing your request');
    }
    if (resp.bodyUsed) {
        return await resp.json()
    }
    return null;
}

async function put(url, data) {
    let resp = await fetch(url, {
        method: 'PUT',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!resp.ok) {
        alert('An error occurred performing your request');
    }
    if (resp.bodyUsed) {
        return await resp.json()
    }
    return null;
}

function getUser(users, id) {
    let foundUser;
    users.forEach(user => {
        if (user.id === id) {
            foundUser = user;
        }
    })
    if (!foundUser) {
        console.log("nope");
    }
    return foundUser;
}

loadChats();

const socket = io();
socket.on('client_id', async client_id => {
    console.log("client_id");
    await registerSocket(client_id);
    console.log(client_id);
});

socket.on('new_chat', async message => {
    console.log("new_chat");
    await registerSocket(client_id);
    console.log(client_id);
});

socket.on('receive_message', async message => {
    console.log("receiving_message");
    await registerSocket(client_id);
    console.log(client_id);
});
/*
socket.onAny((event, ...args) => {
    console.log(event, args);
});
*/