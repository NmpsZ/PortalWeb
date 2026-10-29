CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    photo_url TEXT DEFAULT '',
    phone_number VARCHAR(50) DEFAULT '',
    email VARCHAR(100) DEFAULT '',
    address TEXT DEFAULT '',
    skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS profile_histories (
    id SERIAL PRIMARY KEY,
    user_id INT,
    field_changed VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Ensure TIMESTAMPTZ
ALTER TABLE profile_histories ALTER COLUMN created_at TYPE TIMESTAMPTZ;
ALTER TABLE users ALTER COLUMN created_at TYPE TIMESTAMPTZ;
ALTER TABLE users ALTER COLUMN updated_at TYPE TIMESTAMPTZ;

INSERT INTO skills (name) VALUES ('Go'), ('React'), ('Flutter'), ('CI/CD')
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (id, full_name, last_name, phone_number, email, address, skills)
VALUES (
    1, 
    'Siraphop', 
    'Chootong',  
    '081-234-5678', 
    'john.doe@example.com', 
    '123 Sukhumvit Rd, Bangkok 10110',
    ARRAY['Go', 'React']
)
ON CONFLICT (id) DO NOTHING;
