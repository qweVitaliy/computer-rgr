function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("error");

    if (!username || !password) {
        errorDiv.textContent = "Please enter your name and password.";
        errorDiv.style.display = "block";
        return;
    }

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(async (res) => {
            if (res.status == 401) {
                errorDiv.textContent = "Username or password is incorrect.";
                errorDiv.style.display = "block";
                return;
            }

            const user = await res.json();
            sessionStorage.setItem("currentUser", JSON.stringify(user));

            window.location.href = "/main-page.html";
        })
        .catch(err => {
            console.log(err);
        });
}