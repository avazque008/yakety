document.querySelector('.appear-signup-btn')
    .addEventListener("click", async function () {
        document.querySelector('.login-form').hidden = true;
        document.querySelector('.signup-form').removeAttribute('hidden');
        document.querySelector('.appear-signup-btn').hidden = true;
    }, false);