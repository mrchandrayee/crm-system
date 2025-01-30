CREATE TABLE clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    company TEXT,
    notes TEXT,
    lastInteraction TEXT,
    status TEXT CHECK(status IN ('active', 'inactive', 'potential')) NOT NULL DEFAULT 'potential',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_updated ON clients(updatedAt);
