CREATE TABLE IF NOT EXISTS country (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS firm (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    country_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT fk_firm_country
    FOREIGN KEY (country_id)
    REFERENCES country(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS computer (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    firm_id INTEGER NOT NULL,
    model VARCHAR(100) NOT NULL,
    cpu VARCHAR(100),
    ram_gb INTEGER,
    price NUMERIC(10,2),
    CONSTRAINT fk_computer_firm
    FOREIGN KEY (firm_id)
    REFERENCES firm(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'USER',
    CONSTRAINT chk_user_role
    CHECK (role IN ('USER', 'ADMIN'))
);

INSERT INTO country (name)
SELECT 'USA'
    WHERE NOT EXISTS (
    SELECT 1 FROM country WHERE name = 'USA'
);

INSERT INTO firm (country_id, name)
SELECT c.id, 'Apple'
FROM country c
WHERE c.name = 'USA'
    AND NOT EXISTS (
    SELECT 1 FROM firm f WHERE f.name = 'Apple'
);


INSERT INTO computer (firm_id, model, cpu, ram_gb, price)
SELECT f.id, 'MacBook Pro', 'Apple M2', 16, 2499.99
FROM firm f
WHERE f.name = 'Apple'
    AND NOT EXISTS (
    SELECT 1 FROM computer c WHERE c.model = 'MacBook Pro'
);

INSERT INTO users (username, password, role)
VALUES ('admin', 'YWRtaW4xMjM=', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, password, role)
VALUES ('user', 'dXNlcg==', 'USER')
ON CONFLICT (username) DO NOTHING;