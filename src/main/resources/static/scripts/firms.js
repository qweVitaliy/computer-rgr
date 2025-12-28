let firms = [];

(() => {
    let modalState = { mode: null, id: null };

    document.addEventListener("DOMContentLoaded", () => {
        ensureFirmModal();

        loadFirms();

        const btnAdd = document.getElementById("btnAddFirm");
        if (btnAdd) {
            btnAdd.addEventListener("click", () => openFirmModalCreate());
        }

        const tbody = document.getElementById("firmsTbody");
        if (tbody) {
            tbody.addEventListener("click", (e) => {
                const btn = e.target.closest("button[data-action]");
                if (!btn) return;

                const row = btn.closest("tr[data-id]");
                const id = row ? Number(row.dataset.id) : null;
                if (!id) return;

                const action = btn.dataset.action;

                if (action === "edit") onEditFirm(id);
                if (action === "delete") onDeleteFirm(id);
            });
        }
    });

    async function loadFirms() {
        setState("Loading...", false);

        try {

            const firmsRes = await fetch("/firms");
            if (!firmsRes.ok) {
                setState("Failed to load firms", false);
                return;
            }

            const firmsData = await firmsRes.json();
            firms = (Array.isArray(firmsData) ? firmsData : []).sort((a, b) => a.id - b.id);

            renderFirms(firms);

            if (firms.length === 0) setState("No firms found", false);
            else setState("", true);

        } catch (err) {
            console.error(err);
            setState("Server error while loading firms", false);
        }
    }

    function setState(text, showTable) {
        const state = document.getElementById("firmsState");
        const table = document.getElementById("firmsTable");

        if (state) {
            state.textContent = text || "";
            state.style.display = text ? "block" : "none";
        }
        if (table) table.style.display = showTable ? "table" : "none";
    }

    function onEditFirm(id) {
        const firm = firms.find((x) => x.id === id);
        if (!firm) return;
        openFirmModalEdit(firm);
    }

    function onDeleteFirm(id) {
        const firm = firms.find((x) => x.id === id);
        if (!firm) return;

        const ok = confirm(`Delete "${firm.name}" ?`);
        if (!ok) return;

        fetch(`/firms/${id}`, { method: "DELETE" }).then((res) => {
            if (res.status === 200 || res.status === 204) {
                firms = firms.filter((x) => x.id !== id);
                renderFirms(firms);

                if (firms.length === 0) setState("No firms found", false);
                else setState("", true);
            }
        });
    }

    function openFirmModalCreate() {
        modalState = { mode: "create", id: null };
        setModalTitle("Add firm");
        setModalNameValue("");
        setModalCountryValue("");
        fillCountriesSelect();
        setModalError("");
        showModal(true);
    }

    function openFirmModalEdit(firm) {
        modalState = { mode: "edit", id: firm.id };
        setModalTitle("Edit firm");
        setModalNameValue(firm.name);
        fillCountriesSelect(firm.countryId);
        setModalError("");
        showModal(true);
    }

    function saveFirmFromModal() {
        const name = (getModalNameValue() || "").trim();
        const countryIdRaw = getModalCountryValue();
        const countryId = countryIdRaw ? Number(countryIdRaw) : null;

        if (!name) {
            setModalError("Name is required");
            return;
        }

        if (!countryId) {
            setModalError("Country is required");
            return;
        }

        setModalError("");

        if (modalState.mode === "create") {
            fetch(`/firms`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, countryId })
            })
                .then(async (res) => {
                    if (res.status === 200) {
                        const newFirm = await res.json();
                        firms.push(newFirm);
                        firms = firms.sort((a, b) => a.id - b.id);

                        renderFirms(firms);
                        showModal(false);
                    }
                })
                .finally(() => {
                    setState("", true);
                });
        }

        if (modalState.mode === "edit") {
            const id = modalState.id;
            const idx = firms.findIndex((x) => x.id === id);
            if (idx === -1) return;

            fetch(`/firms/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, countryId })
            })
                .then(async (res) => {
                    if (res.status === 200) {
                        const updatedFirm = await res.json();
                        firms[idx] = updatedFirm;

                        renderFirms(firms);
                    }
                })
                .finally(() => {
                    showModal(false);
                });
        }
    }

    function ensureFirmModal() {
        if (document.getElementById("firmModal")) return;

        const modalHtml = `
            <div id="firmModal" class="modal-backdrop" style="display:none;">
                  <div class="modal">
                        <div class="modal-head">
                              <div id="firmModalTitle" class="modal-title">Modal</div>
                              <button id="firmModalClose" class="modal-x" type="button">×</button>
                        </div>
                
                        <div class="modal-body">
                              <label class="modal-label">Firm name</label>
                              <input id="firmModalName" class="modal-input" type="text" placeholder="Firm name..." />
                    
                              <label class="modal-label" style="margin-top:12px;">Country</label>
                              <select id="firmModalCountry" class="modal-select"></select>
                    
                              <div id="firmModalError" class="modal-error"></div>
                        </div>
                
                        <div class="modal-actions">
                              <button id="firmModalCancel" class="btn btn-ghost" type="button">Cancel</button>
                              <button id="firmModalSave" class="btn btn-primary" type="button">Save</button>
                        </div>
                  </div>
            </div>
        `;

        document.body.insertAdjacentHTML("beforeend", modalHtml);

        document.getElementById("firmModalClose").addEventListener("click", () => showModal(false));
        document.getElementById("firmModalCancel").addEventListener("click", () => showModal(false));
        document.getElementById("firmModalSave").addEventListener("click", () => saveFirmFromModal());

        document.getElementById("firmModal").addEventListener("click", (e) => {
            if (e.target.id === "firmModal") showModal(false);
        });

        document.getElementById("firmModalName").addEventListener("keydown", (e) => {
            if (e.key === "Enter") saveFirmFromModal();
        });
    }

    function fillCountriesSelect(selectedCountryId) {
        const select = document.getElementById("firmModalCountry");
        if (!select) return;

        select.innerHTML = "";

        const opt0 = document.createElement("option");
        opt0.value = "";
        opt0.textContent = "Select country...";
        select.appendChild(opt0);

        countries.forEach((c) => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.name;

            if (selectedCountryId != null && Number(selectedCountryId) === Number(c.id)) {
                opt.selected = true;
            }

            select.appendChild(opt);
        });
    }

    function showModal(isOpen) {
        const modal = document.getElementById("firmModal");
        if (!modal) return;
        modal.style.display = isOpen ? "flex" : "none";

        if (isOpen) {
            setTimeout(() => {
                const inp = document.getElementById("firmModalName");
                if (inp) inp.focus();
            }, 0);
        }
    }

    function setModalTitle(text) {
        const el = document.getElementById("firmModalTitle");
        if (el) el.textContent = text;
    }

    function setModalNameValue(value) {
        const inp = document.getElementById("firmModalName");
        if (inp) inp.value = value ?? "";
    }

    function getModalNameValue() {
        const inp = document.getElementById("firmModalName");
        return inp ? inp.value : "";
    }

    function setModalCountryValue(value) {
        const sel = document.getElementById("firmModalCountry");
        if (sel) sel.value = value ?? "";
    }

    function getModalCountryValue() {
        const sel = document.getElementById("firmModalCountry");
        return sel ? sel.value : "";
    }

    function setModalError(text) {
        const el = document.getElementById("firmModalError");
        if (!el) return;
        el.textContent = text || "";
        el.style.display = text ? "block" : "none";
    }
})();

function renderFirms(list) {
    const table = document.getElementById("firmsTable");
    const tbody = document.getElementById("firmsTbody");
    if (!table || !tbody) return;

    tbody.innerHTML = "";

    list.forEach(async  (f) => {
        if (countries.length === 0) {
            const countriesRes = await fetch("/countries");
            if (!countriesRes.ok) {
                setState("Failed to load firms", false);
                return;
            }
            countries = await countriesRes.json();
        }
        const tr = document.createElement("tr");
        tr.dataset.id = f.id;

        const countryName = getCountryNameById(f.countryId);

        tr.innerHTML = `
                <td>${f.name}</td>
                <td>${countryName}</td>
                <td class="td-actions">
                    <button class="btn btn-ghost" type="button" data-action="edit">Edit</button>
                    <button class="btn btn-danger" type="button" data-action="delete">Delete</button>
                </td>
            `;

        tbody.appendChild(tr);
    });

    table.style.display = "table";
}

function getCountryNameById(countryId) {
    const c = countries.find(x => x.id === countryId);
    return c ? c.name : "Unknown";
}