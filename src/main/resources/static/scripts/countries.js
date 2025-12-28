let countries = [];
(() => {
    let modalState = {mode: null, id: null};

    document.addEventListener("DOMContentLoaded", () => {
        ensureCountryModal();

        loadCountries();

        const btnAdd = document.getElementById("btnAddCountry");
        if (btnAdd) {
            btnAdd.addEventListener("click", () => openCountryModalCreate());
        }

        const tbody = document.getElementById("countriesTbody");
        if (tbody) {
            tbody.addEventListener("click", (e) => {
                const btn = e.target.closest("button[data-action]");
                if (!btn) return;

                const row = btn.closest("tr[data-id]");
                const id = row ? Number(row.dataset.id) : null;
                if (!id) return;

                const action = btn.dataset.action;

                if (action === "edit") onEditCountry(id);
                if (action === "delete") onDeleteCountry(id);
            });
        }
    });

    async function loadCountries() {
        setState("Loading...", false);

        try {
            const response = await fetch("/countries");

            if (!response.ok) {
                window.location.href = "/login-page.html";
                return;
            }

            const data = await response.json();
            countries = (Array.isArray(data) ? data : []).sort((a, b) => a.id - b.id);

            renderCountries(countries);

            if (countries.length === 0) setState("No countries found", false);
            else setState("", true);
        } catch (err) {
            console.error(err);
            setState("Server error while loading countries", false);
        }
    }

    function renderCountries(list) {
        const table = document.getElementById("countriesTable");
        const tbody = document.getElementById("countriesTbody");
        if (!table || !tbody) return;

        tbody.innerHTML = "";

        list.forEach((c) => {
            const tr = document.createElement("tr");
            tr.dataset.id = c.id;

            tr.innerHTML = `
      <td>${c.name}</td>
      <td class="td-actions">
        <button class="btn btn-ghost" type="button" data-action="edit">Edit</button>
        <button class="btn btn-danger" type="button" data-action="delete">Delete</button>
      </td>
    `;

            tbody.appendChild(tr);
        });

        table.style.display = "table";
    }

    function setState(text, showTable) {
        const state = document.getElementById("countriesState");
        const table = document.getElementById("countriesTable");

        if (state) {
            state.textContent = text || "";
            state.style.display = text ? "block" : "none";
        }
        if (table) table.style.display = showTable ? "table" : "none";
    }

    function onEditCountry(id) {
        const country = countries.find((x) => x.id === id);
        if (!country) return;
        openCountryModalEdit(country);
    }

    function onDeleteCountry(id) {
        const country = countries.find((x) => x.id === id);
        if (!country) return;

        const ok = confirm(`Delete "${country.name}" ?`);
        if (!ok) return;


        fetch(`/countries/${id}`, { method: "DELETE" }).then((res) => {
            if (res.status === 200 || res.status === 204) {
                countries = countries.filter((x) => x.id !== id);
                renderCountries(countries);
                setState(countries.length ? "" : "No countries found", countries.length > 0);

                const removedFirmIds = firms
                    .filter(f => f.countryId === id)
                    .map(f => f.id);

                firms = firms.filter(f => f.countryId !== id);
                renderFirms(firms);

                computers = computers.filter(c => !removedFirmIds.includes(c.firmId));
                renderComputers(computers);
            }
        });
    }

    function openCountryModalCreate() {
        modalState = {mode: "create", id: null};
        setModalTitle("Add country");
        setModalInputValue("");
        setModalError("");
        showModal(true);
    }

    function openCountryModalEdit(country) {
        modalState = {mode: "edit", id: country.id};
        setModalTitle("Edit country");
        setModalInputValue(country.name);
        setModalError("");
        showModal(true);
    }

    function saveCountryFromModal() {
        const name = (getModalInputValue() || "").trim();

        if (!name) {
            setModalError("Name is required");
            return;
        }

        setModalError("");

        if (modalState.mode === "create") {
            fetch(`/countries`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                })
            })
                .then(async (res) => {
                    if (res.status === 200) {
                        const newCountry = await res.json();
                        countries.push(newCountry);

                        renderCountries(countries);
                        setState("", true);
                        return;
                    }
                })
                .finally(() => {
                    showModal(false);
                });
        }

        if (modalState.mode === "edit") {
            const id = modalState.id;
            const idx = countries.findIndex((x) => x.id === id);
            if (idx === -1) return;

            fetch(`countries/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                })
            })
                .then(async (res) => {
                    if (res.status === 200) {
                        const updatedCountry = await res.json();
                        countries[idx] = updatedCountry;

                        renderCountries(countries);
                        return;
                    }
                })
                .finally(() => {
                    showModal(false);
                });
        }
    }

    function ensureCountryModal() {
        if (document.getElementById("countryModal")) return;

        const modalHtml = `
            <div id="countryModal" class="modal-backdrop" style="display:none;">
              <div class="modal">
                <div class="modal-head">
                  <div id="countryModalTitle" class="modal-title">Modal</div>
                  <button id="countryModalClose" class="modal-x" type="button">×</button>
                </div>
        
                <div class="modal-body">
                  <label class="modal-label">Name</label>
                  <input id="countryModalName" class="modal-input" type="text" placeholder="Country name..." />
                  <div id="countryModalError" class="modal-error"></div>
                </div>
        
                <div class="modal-actions">
                  <button id="countryModalCancel" class="btn btn-ghost" type="button">Cancel</button>
                  <button id="countryModalSave" class="btn btn-primary" type="button">Save</button>
                </div>
              </div>
            </div>
          `;

        document.body.insertAdjacentHTML("beforeend", modalHtml);

        document.getElementById("countryModalClose").addEventListener("click", () => showModal(false));
        document.getElementById("countryModalCancel").addEventListener("click", () => showModal(false));
        document.getElementById("countryModalSave").addEventListener("click", () => saveCountryFromModal());

        document.getElementById("countryModal").addEventListener("click", (e) => {
            if (e.target.id === "countryModal") showModal(false);
        });

        document.getElementById("countryModalName").addEventListener("keydown", (e) => {
            if (e.key === "Enter") saveCountryFromModal();
        });
    }

    function showModal(isOpen) {
        const modal = document.getElementById("countryModal");
        if (!modal) return;
        modal.style.display = isOpen ? "flex" : "none";

        if (isOpen) {
            setTimeout(() => {
                const inp = document.getElementById("countryModalName");
                if (inp) inp.focus();
            }, 0);
        }
    }

    function setModalTitle(text) {
        const el = document.getElementById("countryModalTitle");
        if (el) el.textContent = text;
    }

    function setModalInputValue(value) {
        const inp = document.getElementById("countryModalName");
        if (inp) inp.value = value ?? "";
    }

    function getModalInputValue() {
        const inp = document.getElementById("countryModalName");
        return inp ? inp.value : "";
    }

    function setModalError(text) {
        const el = document.getElementById("countryModalError");
        if (!el) return;
        el.textContent = text || "";
        el.style.display = text ? "block" : "none";
    }

})();