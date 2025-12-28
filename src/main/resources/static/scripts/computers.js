let computers = [];

(() => {
    let modalState = { mode: null, id: null };

    document.addEventListener("DOMContentLoaded", () => {
        ensureComputerModal();

        loadComputers();

        const btnAdd = document.getElementById("btnAddComputer");
        if (btnAdd) btnAdd.addEventListener("click", () => openComputerModalCreate());

        const tbody = document.getElementById("computersTbody");
        if (tbody) {
            tbody.addEventListener("click", (e) => {
                const btn = e.target.closest("button[data-action]");
                if (!btn) return;

                const row = btn.closest("tr[data-id]");
                const id = row ? Number(row.dataset.id) : null;
                if (!id) return;

                const action = btn.dataset.action;
                if (action === "edit") onEditComputer(id);
                if (action === "delete") onDeleteComputer(id);
            });
        }
    });

    async function loadComputers() {
        setState("Loading...", false);

        try {
            const response = await fetch("/computers");

            if (!response.ok) {
                window.location.href = "/login-page.html";
                return;
            }

            const data = await response.json();
            computers = (Array.isArray(data) ? data : []).sort((a, b) => a.id - b.id);

            renderComputers(computers);

            if (computers.length === 0) setState("No computers found", false);
            else setState("", true);
        } catch (err) {
            console.error(err);
            setState("Server error while loading computers", false);
        }
    }


    function setState(text, showTable) {
        const state = document.getElementById("computersState");
        const table = document.getElementById("computersTable");

        if (state) {
            state.textContent = text || "";
            state.style.display = text ? "block" : "none";
        }
        if (table) table.style.display = showTable ? "table" : "none";
    }

    function onEditComputer(id) {
        const computer = computers.find((x) => x.id === id);
        if (!computer) return;
        openComputerModalEdit(computer);
    }

    function onDeleteComputer(id) {
        const computer = computers.find((x) => x.id === id);
        if (!computer) return;

        const ok = confirm(`Delete "${computer.model}" ?`);
        if (!ok) return;

        fetch(`/computers/${id}`, { method: "DELETE" }).then((res) => {
            if (res.status === 200 || res.status === 204) {
                computers = computers.filter((x) => x.id !== id);
                renderComputers(computers);

                if (computers.length === 0) setState("No computers found", false);
                else setState("", true);
            }
        });
    }

    function openComputerModalCreate() {
        modalState = { mode: "create", id: null };
        setModalTitle("Add computer");
        setModalError("");
        setModalValues({ model: "", cpu: "", ramGb: "", price: "", firmId: "" });
        showModal(true);
    }

    function openComputerModalEdit(computer) {
        modalState = { mode: "edit", id: computer.id };
        setModalTitle("Edit computer");
        setModalError("");
        setModalValues({
            model: computer.model ?? "",
            cpu: computer.cpu ?? "",
            ramGb: computer.ramGb ?? "",
            price: computer.price ?? "",
            firmId: computer.firmId ?? ""
        });
        showModal(true);
    }

    function saveComputerFromModal() {
        const model = (getValue("computerModalModel") || "").trim();
        const cpu = (getValue("computerModalCpu") || "").trim();

        const ramGbRaw = (getValue("computerModalRam") || "").trim();
        const priceRaw = (getValue("computerModalPrice") || "").trim();

        const firmIdRaw = getValue("computerModalFirm");
        const firmId = firmIdRaw ? Number(firmIdRaw) : null;

        if (!model) {
            setModalError("Model is required");
            return;
        }
        if (!firmId) {
            setModalError("Firm is required");
            return;
        }

        const ramGb = ramGbRaw === "" ? null : Number(ramGbRaw);
        if (ramGbRaw !== "" && (Number.isNaN(ramGb) || ramGb < 0)) {
            setModalError("RAM must be a number (>= 0)");
            return;
        }

        let price = null;
        if (priceRaw !== "") {
            const p = Number(priceRaw);
            if (Number.isNaN(p) || p < 0) {
                setModalError("Price must be a number (>= 0)");
                return;
            }
            price = priceRaw; // строкой ок
        }

        setModalError("");

        const payload = {
            model,
            cpu: cpu === "" ? null : cpu,
            ramGb: ramGbRaw === "" ? null : ramGb,
            price: price,
            firmId
        };

        if (modalState.mode === "create") {
            fetch(`/computers`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
                .then(async (res) => {
                    if (res.status === 200) {
                        const newItem = await res.json();
                        computers.push(newItem);
                        computers = computers.sort((a, b) => a.id - b.id);

                        renderComputers(computers);
                        setState("", true);
                        return;
                    }
                    if (res.status === 401) window.location.href = "/login-page.html";
                })
                .finally(() => showModal(false));
        }

        if (modalState.mode === "edit") {
            const id = modalState.id;
            const idx = computers.findIndex((x) => x.id === id);
            if (idx === -1) return;

            fetch(`/computers/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
                .then(async (res) => {
                    if (res.status === 200) {
                        const updated = await res.json();
                        computers[idx] = updated;

                        renderComputers(computers);
                        return;
                    }
                    if (res.status === 401) window.location.href = "/login-page.html";
                })
                .finally(() => showModal(false));
        }
    }

    function ensureComputerModal() {
        if (document.getElementById("computerModal")) return;

        const modalHtml = `
            <div id="computerModal" class="modal-backdrop" style="display:none;">
              <div class="modal">
                <div class="modal-head">
                  <div id="computerModalTitle" class="modal-title">Modal</div>
                  <button id="computerModalClose" class="modal-x" type="button">×</button>
                </div>

                <div class="modal-body">
                  <label class="modal-label">Model *</label>
                  <input id="computerModalModel" class="modal-input" type="text" placeholder="e.g. Dell XPS 15" />

                  <label class="modal-label" style="margin-top:12px;">CPU</label>
                  <input id="computerModalCpu" class="modal-input" type="text" placeholder="e.g. i5-12500H" />

                  <div style="display:flex; gap:10px; margin-top:12px;">
                    <div style="flex:1;">
                      <label class="modal-label">RAM (GB)</label>
                      <input id="computerModalRam" class="modal-input" type="number" min="0" placeholder="e.g. 16" />
                    </div>
                    <div style="flex:1;">
                      <label class="modal-label">Price</label>
                      <input id="computerModalPrice" class="modal-input" type="number" min="0" step="0.01" placeholder="e.g. 999.99" />
                    </div>
                  </div>

                  <label class="modal-label" style="margin-top:12px;">Firm *</label>
                  <select id="computerModalFirm" class="modal-select"></select>

                  <div id="computerModalError" class="modal-error"></div>
                </div>

                <div class="modal-actions">
                  <button id="computerModalCancel" class="btn btn-ghost" type="button">Cancel</button>
                  <button id="computerModalSave" class="btn btn-primary" type="button">Save</button>
                </div>
              </div>
            </div>
        `;

        document.body.insertAdjacentHTML("beforeend", modalHtml);

        document.getElementById("computerModalClose").addEventListener("click", () => showModal(false));
        document.getElementById("computerModalCancel").addEventListener("click", () => showModal(false));
        document.getElementById("computerModalSave").addEventListener("click", () => saveComputerFromModal());

        document.getElementById("computerModal").addEventListener("click", (e) => {
            if (e.target.id === "computerModal") showModal(false);
        });

        document.getElementById("computerModalModel").addEventListener("keydown", (e) => {
            if (e.key === "Enter") saveComputerFromModal();
        });
    }

    function fillFirmSelect(selectedFirmId) {
        const select = document.getElementById("computerModalFirm");
        if (!select) return;

        select.innerHTML = "";

        const opt0 = document.createElement("option");
        opt0.value = "";
        opt0.textContent = "Select firm...";
        select.appendChild(opt0);

        firms.forEach((f) => {
            const opt = document.createElement("option");
            opt.value = f.id;
            opt.textContent = f.name;

            if (selectedFirmId != null && Number(selectedFirmId) === Number(f.id)) {
                opt.selected = true;
            }

            select.appendChild(opt);
        });
    }

    function showModal(isOpen) {
        const modal = document.getElementById("computerModal");
        if (!modal) return;

        modal.style.display = isOpen ? "flex" : "none";

        if (isOpen) {
            const current = getValue("computerModalFirm");
            fillFirmSelect(current);

            setTimeout(() => {
                const inp = document.getElementById("computerModalModel");
                if (inp) inp.focus();
            }, 0);
        }
    }

    function setModalTitle(text) {
        const el = document.getElementById("computerModalTitle");
        if (el) el.textContent = text;
    }

    function setModalValues(v) {
        setValue("computerModalModel", v.model);
        setValue("computerModalCpu", v.cpu);
        setValue("computerModalRam", v.ramGb);
        setValue("computerModalPrice", v.price);

        fillFirmSelect(v.firmId);
    }

    function setValue(id, value) {
        const el = document.getElementById(id);
        if (!el) return;
        el.value = value ?? "";
    }

    function getValue(id) {
        const el = document.getElementById(id);
        return el ? el.value : "";
    }

    function setModalError(text) {
        const el = document.getElementById("computerModalError");
        if (!el) return;
        el.textContent = text || "";
        el.style.display = text ? "block" : "none";
    }
})();

function renderComputers(list) {
    const table = document.getElementById("computersTable");
    const tbody = document.getElementById("computersTbody");
    if (!table || !tbody) return;

    tbody.innerHTML = "";

    list.forEach(async (c) => {
        if (firms.length == 0) {
            const firmsRes = await fetch("/firms");
            if (!firmsRes.ok) {
                setState("Failed to load firms", false);
                return;
            }
            firms = await firmsRes.json();
        }
        const tr = document.createElement("tr");
        tr.dataset.id = c.id;

        const firm = firms.find((f) => f.id === c.firmId);
        const firmName = firm ? firm.name : "Unknown";

        const cpuText = c.cpu ? c.cpu : "-";
        const ramText = (c.ramGb === 0 || c.ramGb) ? `${c.ramGb} GB` : "-";
        const priceText = (c.price === 0 || c.price) ? `${c.price}` : "-";

        tr.innerHTML = `
                <td>${c.model}</td>
                <td>${cpuText}</td>
                <td>${ramText}</td>
                <td>${priceText}</td>
                <td>${firmName}</td>
                <td class="td-actions">
                    <button class="btn btn-ghost" type="button" data-action="edit">Edit</button>
                    <button class="btn btn-danger" type="button" data-action="delete">Delete</button>
                </td>
            `;

        tbody.appendChild(tr);
    });

    table.style.display = "table";
}