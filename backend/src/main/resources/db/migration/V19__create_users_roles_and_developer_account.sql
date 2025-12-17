-- ============================================================
--  Flyway Migration: V10__create_users_roles_and_developer_account.sql
--  Purpose: Create authentication, role management tables and default developer account
--  Note: This is a consolidated migration replacing V10-V23 for clean initial setup
-- ============================================================

-- === Create Schema ===
CREATE SCHEMA IF NOT EXISTS app;

-- === Extensions ===
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- === Roles Table ===
CREATE TABLE IF NOT EXISTS roles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(50) NOT NULL UNIQUE,
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_roles_name ON roles(name);

-- === Users Table ===
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username        VARCHAR(50) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    enabled         BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    allowed_pages   TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS ix_users_username ON users(username);

-- === User_Roles Junction Table ===
CREATE TABLE IF NOT EXISTS user_roles (
    user_id         UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    role_id         UUID NOT NULL REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    assigned_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX IF NOT EXISTS ix_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS ix_user_roles_role ON user_roles(role_id);

-- === Insert Default Roles ===
INSERT INTO roles (id, name, description) VALUES
    ('11111111-1111-1111-1111-111111111111'::uuid, 'ROLE_DEVELOPER', 'System Developer with full access'),
    ('22222222-2222-2222-2222-222222222222'::uuid, 'ROLE_ADMIN', 'Administrator with full system access'),
    ('33333333-3333-3333-3333-333333333333'::uuid, 'ROLE_USER', 'User with standard access')
ON CONFLICT (name) DO NOTHING;

-- === Insert Default Developer User ===
-- Username: developer
-- Password: developer123 (BCrypt hash with 10 rounds)
-- Allowed Pages: All pages by default
INSERT INTO users (id, username, password_hash, enabled, created_at, updated_at, allowed_pages)
VALUES (
    'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid,
    'developer',
    crypt('developer123', gen_salt('bf', 10)),
    true,
    NOW(),
    NOW(),
    'home,register-delivery,warehouse,production-usage,outbound-shipping,users,profile'
)
ON CONFLICT (username) DO NOTHING;

-- === Assign ROLE_DEVELOPER to Developer User ===
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'developer' AND r.name = 'ROLE_DEVELOPER'
AND NOT EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role_id = r.id);

-- ============================================================
-- End of V10__create_users_roles_and_developer_account.sql
-- ============================================================
