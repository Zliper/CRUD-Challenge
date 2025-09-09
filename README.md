# Reto Técnico – Desarrollo Web

Esta aplicacion web permite:
 - Iniciar sesion con credenciales
 - Administrar usuarios mediante CRUD
 - Manejar roles de acceso (Administrador / Usuario)
 - Autenticacion con JWT
 - Interfaz con Bootstrap y Fetch API

--------------------------------------------------------------------------

 ## STACK
 - Backend: Node.js + Express
 - Base de datos: SQLite3
 - Autenticacion: JWT = bcrypt
 - Frontend: HTML, Bootstrap, FetchAPI
 - Estructura POO: Modelos para conexion, usuarios y autenticacion

 -------------------------------------------------------------------------

 ## Estructura
 <pre>
challenge-crud/
│
├── server.js # Servidor Express principal
├── models/ # Modelos (User, DB, Auth)
├── routes/ # Rutas de API
├── public/ # Frontend (HTML, Bootstrap, JS)
│ ├── index.html # Login
│ ├── dashboard.html # Panel CRUD
│ └── script.js # Lógica frontend con Fetch API
└── init.sql # Script para inicializar DB
</pre>

## Instalacion y ejecucuion
1. Clonar el repositorio
   git clone https://github.com/Zliper/CRUD-Challenge.git
   cd project

2. Instalar dependencias
    npm install express sqlite3 bcrypt jsonwebtoken

3. Inicializar base de datos
    sqlite3 database.sqlite < init.sql

4. Iniciar el servidor
    node server.js

5. Abrir la aplicacion en el navegador
    http://127.0.0.1:8080

## Usuario administrador inicial
 - email: admin@email.com
 - password: admin123

## Endpoints principales
 - POST /auth/login => Iniciar sesion
 - GET /users => Mostrar usuarios (admin)
 - POST /users => Crear nuevo usuario (admin)
 - PUT /users/:id => Editar usuario (admin o usuario dueño de la cuenta)
 - DELETE /users/:id => Eliminar usuario (admin)

 ## Notas
 - Contraseñas almacenadas con bcrypt
 - Autenticacion y autorizacion con JWT en headers.
 - Validaciones basicas en frontend y backend
 - Diseño responsivo con Bootstrap

 ## Roles de usuario
 - Administrador: puede crear, editar y eliminar cualquier usuario
 - Usuario: solo puede ver/ editar su propio perfil
