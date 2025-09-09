CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin','user')) NOT NULL
);

--password admin123
INSERT INTO users (name, email, password, role) VALUES ('Admin', 'admin@email.com', '$2b$10$B70hYaoL4XbHYm5FlX84auY6rt.Rnu5JeeTEsfkXdlWIPjhIWFd86', 'admin');