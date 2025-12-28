let modalState = { mode: null, id: null };
const savedJSON = sessionStorage.getItem("currentUser");
const user = JSON.parse(savedJSON);

(function () {
    if (user) {
        document.getElementById("username").textContent = user.username;
    }
    else {
        window.location.href = "/login-page.html";
    }
})()

function logout() {
    sessionStorage.removeItem("currentUser");

    fetch("/logout", {}).then(res => {
        window.location.href = "/login-page.html";
    })
}

document.addEventListener("DOMContentLoaded", () => {
    const navCountries = document.getElementById("navCountries");
    const navFirms = document.getElementById("navFirms");
    const navComputers = document.getElementById("navComputers");

    navCountries?.addEventListener("click", () => switchView("countries"));
    navFirms?.addEventListener("click", () => switchView("firms"));
    navComputers?.addEventListener("click", () => switchView("computers"));

    switchView("countries");

    function switchView(view) {
        document.getElementById("viewCountries").style.display = view === "countries" ? "block" : "none";
        document.getElementById("viewFirms").style.display = view === "firms" ? "block" : "none";
        document.getElementById("viewComputers").style.display = view === "computers" ? "block" : "none";

        navCountries?.classList.toggle("active", view === "countries");
        navFirms?.classList.toggle("active", view === "firms");
        navComputers?.classList.toggle("active", view === "computers");

        const title = document.querySelector(".page-title");
        if (title) title.textContent = view === "firms" ? "Firms" : view === "countries" ? "Countries" : "Computers";

        if (view === "countries" && window.CountriesView?.load) window.CountriesView.load();
        if (view === "firms" && window.FirmsView?.load) window.FirmsView.load();
        if (view === "computers" && window.ComputersView?.load) window.ComputersView.load();
    }
});

