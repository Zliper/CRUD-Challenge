const API_URL = "http://127.0.0.1:8080";
let token = localStorage.getItem("token");
let userData;

// ---------- LOGIN ----------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "dashboard.html";
        } else {
            document.getElementById("loginError").textContent = data.message;
        }
    });
}

const usersTable = document.getElementById("usersTable");
if (usersTable) {

    loadUsers();

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "index.html";
        });
    }

    // Modales
    let createModal;
    const createModalEl = document.getElementById("createUserModal");
    if (createModalEl) {
        createModal = new bootstrap.Modal(createModalEl);

        createModalEl.addEventListener("hidden.bs.modal", () => {
            document.getElementById("createUserFormModal").reset();
            document.getElementById("passwordError").textContent = "";
        });

        const newUserBtn = document.getElementById("newUserBtn");
        if (newUserBtn) {
            newUserBtn.addEventListener("click", () => createModal.show());
        }

        const createForm = document.getElementById("createUserFormModal");
        if (createForm) {
            createForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const name = document.getElementById("newUserName").value;
                const email = document.getElementById("newUserEmail").value;
                const password = document.getElementById("newUserPassword").value;
                const confirmPassword = document.getElementById("newUserPasswordConfirmation").value;
                const role = document.getElementById("newUserRole").value;
                const passwordError = document.getElementById("passwordError");

                if (password !== confirmPassword) {
                    passwordError.textContent = "Las contraseñas no coinciden";
                    return;
                }

                try {
                    const res = await fetch(`${API_URL}/users`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ name, email, password, role }),
                    });

                    const data = await res.json();
                    if (res.ok) {
                        createModal.hide();
                        loadUsers();
                        alert("Usuario creado correctamente");
                    } else {
                        alert(data.message || "Error al crear usuario");
                    }
                } catch (err) {
                    alert("Error al conectar con el servidor");
                }
                passwordError.textContent = "";
            });
        }
    }

    let editModal;
    const editModalEl = document.getElementById("editUserModal");
    if (editModalEl) {
        editModal = new bootstrap.Modal(editModalEl);

        const editForm = document.getElementById("editUserForm");
        if (editForm) {
            editForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const id = document.getElementById("editUserId").value;
                const name = document.getElementById("editName").value;
                const email = document.getElementById("editEmail").value;
                const role = document.getElementById("editRole").value;
                const password = document.getElementById("editPassword").value;

                const res = await fetch(`${API_URL}/users/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name, email, role, ...(password ? { password } : {}) }),
                });

                const data = await res.json();
                if (res.ok) {
                    editModal.hide();
                    loadUsers();
                    alert("Usuario actualizado correctamente");
                } else {
                    alert("Error al actualizar\n" + (data.message || ""));
                }
            });
        }
    }

    // ---------- OBTENER INFO USUARIO LOGUEADO ----------
    async function getLoggedUser() {
        const res = await fetch(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("No se pudo obtener el usuario");
        return await res.json();
    }


    // ---------- CARGAR USUARIOS ----------
    async function loadUsers() {
        const res = await fetch(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const users = await res.json();
        const tbody = usersTable.querySelector("tbody");
        tbody.innerHTML = "";

        userData = await getLoggedUser();
        const user = userData;
        const isAdmin = user?.role === "admin";

        const welcomeMsg = document.getElementById("welcomeMsg");
        if (welcomeMsg) welcomeMsg.textContent = `Hola, ${user.name}`;

        const newUserBtn = document.getElementById("newUserBtn");
        if (newUserBtn) newUserBtn.style.display = isAdmin ? "inline-block" : "none";

        users.forEach((u) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${u.id}</td>
              <td>${u.name}</td>
              <td>${u.email}</td>
              <td>${u.role}</td>
              <td>
                <button class="btn btn-sm btn-primary" onclick="editUser(${u.id}, '${u.name}', '${u.email}', '${u.role}')">Editar</button>
                ${isAdmin ? `<button class="btn btn-sm btn-danger" onclick="deleteUser(${u.id})">Eliminar</button>` : ''}
              </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // ---------- FUNCIONES MODALES ----------
    window.editUser = function (id, name, email, role) {
        const isAdmin = userData?.role === "admin";
        if (!editModal) return;
        document.getElementById("editUserId").value = id;
        document.getElementById("editName").value = name;
        document.getElementById("editEmail").value = email;
        const editRoleForm = document.getElementById("editRole");
        editRoleForm.value = role;
        editRoleForm.disabled = !isAdmin;
        document.getElementById("editPassword").value = "";
        editModal.show();
    };

    // ---------- ELIMINAR USUARIO ----------
    window.deleteUser = async function (id) {
        if (!confirm("¿Eliminar usuario?")) return;
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) loadUsers();
        else alert("Error al eliminar\n" + (await res.json()).message);
    };
}

