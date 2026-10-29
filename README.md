# PortalWeb

[![Go Version](https://img.shields.io/badge/Go-1.25-00ADD8?style=flat-square&logo=go)](https://go.dev/)
[![React Version](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![Docker Compose](https://img.shields.io/badge/Docker_Compose-v2-2496ED?style=flat-square&logo=docker)](https://docs.docker.com/compose/)

A modern, full-stack enterprise Employee Profile Web Portal built with clean architectural patterns. Designed for high performance, strict type safety, zero external cloud storage dependencies, and comprehensive auditability.

---

## Table of Contents

- [Overview](#overview)
- [Architecture & Design Principles](#architecture--design-principles)
- [Tech Stack & Library Inventory](#tech-stack--library-inventory)
  - [Backend Dependencies](#backend-dependencies)
  - [Frontend Dependencies](#frontend-dependencies)
- [Key Features](#key-features)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Project Directory Structure](#project-directory-structure)
- [Environment Configuration](#environment-configuration)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Database Setup](#1-database-setup)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Building for Production](#building-for-production)
- [Engineering Standards](#engineering-standards)

---

## Overview

The Employee Profile Portal provides a centralized, secure interface for employees to view and maintain their professional profiles. It enforces strict compliance rules—such as immutable identity fields—while allowing granular updates to contact details, skill proficiencies, and profile photos. Every update is tracked with an immutable 7-day change history audit trail.

---

## Architecture & Design Principles

The application adheres to **Clean Architecture** (Separation of Concerns), ensuring maintainability, testability, and independence from external frameworks.

```
       [ Client Application ] (React + TypeScript + Tailwind CSS)
                  │
                  ▼  HTTP / REST API (JSON)
       [ Presentation Layer ] (Controllers & HTTP Handlers in Go standard library)
                  │
                  ▼
       [ Business Logic Layer ] (Usecases, Whitelist Validation, Normalization)
                  │
                  ▼
       [ Persistence Layer ] (Repositories with pgx/v5 & SQL connection pool)
                  │
                  ▼
       [ PostgreSQL Database ] (users, skills, profile_histories)
```

- **Domain-Driven Modular Structure**: Business entities (`entities`) are decoupled from database models and HTTP transports.
- **Dependency Inversion**: High-level modules do not depend on low-level modules; both depend on abstractions (interfaces).
- **Stateless Backend**: The Go service is stateless, allowing for horizontal scalability.

---

## Tech Stack & Library Inventory

### Backend Dependencies

The backend is built in **Go 1.25** using the `net/http` standard library router (Go 1.22+ method-based route matching) to minimize third-party framework overhead.

| Package / Module | Version | Purpose & Description |
| :--- | :--- | :--- |
| **`net/http`** | Standard Library | Native HTTP server, multiplexer routing, file upload multipart handling, and JSON serialization. |
| **`github.com/jackc/pgx/v5`** | `v5.11.0` | High-performance, pure Go PostgreSQL driver. Supports binary protocol decoding, prepared statements, and robust connection management. |
| **`github.com/jackc/puddle/v2`** | `v2.2.2` | Generic, thread-safe resource pooling library powering `pgxpool` for concurrent database connections. |
| **`github.com/jackc/pgservicefile`** | `v0.0.0` | Parser for PostgreSQL service definition files (`pg_service.conf`). |
| **`github.com/jackc/pgpassfile`** | `v1.0.0` | Parser for `.pgpass` credential files. |
| **`github.com/joho/godotenv`** | `v1.5.1` | Loads local environment variables from `.env` files into `os.Environ` during development. |
| **`github.com/rs/cors`** | `v1.11.1` | Net/http middleware providing Cross-Origin Resource Sharing (CORS) specification compliance. |
| **`golang.org/x/sync`** | `v0.17.0` | Concurrency and synchronization primitives for Go routines. |
| **`golang.org/x/text`** | `v0.29.0` | Text transformations, encodings, and Unicode handling. |

### Frontend Dependencies

The frontend is a single-page application (SPA) created with **React 18**, **TypeScript**, and **Tailwind CSS v4** bundled via **Vite**.

| Package / Module | Version | Purpose & Description |
| :--- | :--- | :--- |
| **`react`** | `^18.3.1` | Core UI library providing component lifecycle, concurrent rendering, and reactive hooks. |
| **`react-dom`** | `^18.3.1` | DOM renderer for React web applications. |
| **`react-router-dom`** | `^6.28.0` | Declarative client-side routing and navigation. |
| **`tailwindcss`** | `^4.3.3` | Next-generation utility-first CSS framework (v4 engine) for responsive, low-overhead styling. |
| **`@tailwindcss/vite`** | `^4.3.3` | Official Vite plugin integrating Tailwind CSS directly into the build pipeline. |
| **`vite`** | `^6.0.1` | Lightning-fast build tool offering instant Hot Module Replacement (HMR) and optimized Rollup bundling. |
| **`typescript`** | `^7.0.2` | Strictly typed JavaScript providing compile-time type safety and interface validation. |
| **`postcss`** | `^8.5.32` | Tool for transforming styles with JS plugins. |
| **`autoprefixer`** | `^10.6.2` | PostCSS plugin to parse CSS and add vendor prefixes automatically. |
| **`@vitejs/plugin-react`** | `^4.3.4` | Enables Fast Refresh and JSX compilation via Babel. |
| **`@types/react`** | `^19.3.0` | TypeScript definitions for React. |
| **`@types/react-dom`** | `^19.3.0` | TypeScript definitions for React DOM. |

---

## Key Features

- **User can view their profile**
  - Full name and Last Name
  - Profile photo
  - Contact Info: Mobile Phone Number, Email, Address
  - Skills
- **User can edit profile**
  - Full name and Last Name. These are read-only. Not allow user to update.
  - Profile photo. This to allow user to upload their profile photo.
  - Contact Info: This info can be updated separately.
    - Mobile Phone Number
    - Email
    - Address
  - Skills. It shows multiple skill options for user to choose. The list of skill options such as Go, React, Flutter, CI/CD. This should be configuration
- **User can see all change history when user update the profile from the past 7 days – configurable**

---

## Database Schema

```sql
-- Core users table
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

-- Whitelisted skills configuration
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Immutable audit log for past profile changes
CREATE TABLE IF NOT EXISTS profile_histories (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    field_changed VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Reference

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description | Request Body | Response (Success) |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | Service health status check | None | `{"status": "ok"}` |
| `GET` | `/profile` | Fetch active user profile (ID: 1) | None | `{"id": 1, "full_name": "...", "skills": [...]}` |
| `PUT` | `/profile/contact` | Update contact information | `{"phone_number": "...", "email": "...", "address": "..."}` | Updated profile object |
| `PUT` | `/profile/skills` | Update skill proficiencies | `{"skills": ["Go", "React", "CI/CD"]}` | Updated profile object |
| `POST` | `/profile/photo` | Upload profile photo (Multipart) | `multipart/form-data` with `photo` binary | Updated profile object |
| `GET` | `/profile/history` | Get change history (past N days) | Query parameter: `?days=7` | Array of `ProfileHistory` records |
| `GET` | `/skills` | Fetch whitelist of configured skills | None | `["Go", "React", "Flutter", "CI/CD"]` |

---

## Project Directory Structure

```
PortalWeb/
├── backend/
│   ├── app/
│   │   └── main.go                         # Server entry point & dependency wiring
│   ├── configs/
│   │   └── configs.go                      # Environment variable loading
│   ├── modules/
│   │   ├── server/
│   │   │   ├── handler.go                  # HTTP route registry & CORS configuration
│   │   │   └── server.go                   # HTTP server lifecycle management
│   │   └── users/
│   │       ├── controllers/
│   │       │   └── users_controller.go     # HTTP request handlers & validation
│   │       ├── entities/
│   │       │   └── users_entity.go         # Domain models & request/response DTOs
│   │       ├── repositories/
│   │       │   └── users_repository.go     # PostgreSQL persistence & audit logging
│   │       └── usecases/
│   │           └── users_usecase.go        # Business logic & normalization rules
│   ├── pkg/
│   │   └── databases/
│   │       ├── postgresql.go               # Database connection pool initialization
│   │       └── schema.sql                  # Database schema DDL & seed data
│   ├── .dockerignore                       # Docker build context exclusions
│   ├── .env.example                        # Backend environment configuration template
│   ├── Dockerfile                          # Multi-stage Go production container build
│   ├── go.mod
│   └── go.sum
│
├── frontend/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                     # Reusable UI primitives (Button, Modal, Toast)
│   │   │   ├── layout/                     # Header, Footer, and page wrappers
│   │   │   └── profile/                    # ProfileCard, ContactCard, SkillsCard, Modals
│   │   ├── hooks/                          # Custom React hooks (useProfile)
│   │   ├── pages/                          # Page views (Home.tsx)
│   │   ├── routes/                         # React Router configuration
│   │   ├── services/                       # API client services (api.ts)
│   │   ├── types/                          # TypeScript definitions & interfaces
│   │   ├── utils/                          # Formatting & helper functions
│   │   ├── App.tsx                         # Root application component
│   │   ├── index.css                       # Tailwind CSS imports
│   │   └── main.tsx                        # React DOM mounting entry point
│   ├── .dockerignore                       # Docker build context exclusions
│   ├── .env.example                        # Frontend environment configuration template
│   ├── Dockerfile                          # Multi-stage React + Nginx container build
│   ├── nginx.conf                          # Production Nginx reverse proxy configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.js
│
├── .gitignore
├── docker-compose.yml                      # Full-stack container orchestration
└── README.md
```

---

## Environment Configuration

Both the backend and frontend include template configuration files (`.env.example`). Copy them to `.env` before running each service.

### Backend (`backend/.env.example` -> `backend/.env`)

```bash
# In backend directory
cp .env.example .env
```

```ini
# Application Server
HOST=localhost
PORT=3000
ENV=development

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
DB_SSLMODE=disable
```

### Frontend (`frontend/.env.example` -> `frontend/.env`)

```bash
# In frontend directory
cp .env.example .env
```

```ini
# Backend REST API Base URL
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## Getting Started

### Option 1: Quick Start with Docker (Recommended)

Run the entire full-stack application (PostgreSQL, Go backend, and React frontend) with a single command. Zero manual dependency installation required.

```bash
# Clone the repository
git clone https://github.com/NmpsZ/PortalWeb.git
cd PortalWeb

# Start all services with automated build & database seeding
docker compose up --build -d
```

#### Service URLs & Port Mappings

| Service | Container Name | Host URL / Port | Description |
| :--- | :--- | :--- | :--- |
| **Web Frontend** | `portalweb_frontend` | [http://localhost:5173](http://localhost:5173) or [http://localhost](http://localhost) | React 18 SPA served via production Nginx reverse proxy |
| **Backend API** | `portalweb_backend` | [http://localhost:3000/api/health](http://localhost:3000/api/health) | Go RESTful service (Clean Architecture) |
| **PostgreSQL** | `portalweb_postgres` | `localhost:5433` (Internal: `5432`) | PostgreSQL 16 Alpine with auto-seeded schema & initial user |

> **Note on PostgreSQL Port**: The database container exposes external host port `5433` (internally `5432`) by default to prevent port allocation collisions with any existing PostgreSQL instance running on your host machine. You can customize this by setting `DB_HOST_PORT=5432` if desired.

#### Common Docker Commands

```bash
# Check container status & health
docker compose ps

# View live streaming logs across all containers
docker compose logs -f

# View live logs for backend only
docker compose logs -f backend

# Stop all running containers
docker compose down

# Stop and wipe database volume for a clean re-initialization
docker compose down -v
```

---

### Option 2: Manual Local Setup

#### Prerequisites

- **Go**: Version `1.22` or higher (Go `1.25` recommended)
- **Node.js**: Version `18.x` or higher & **npm**
- **PostgreSQL**: Version `14.x` or higher running locally or in Docker

---

#### 1. Database Setup

Ensure PostgreSQL is running, then execute the schema initialization script:

```bash
# Connect to PostgreSQL and apply the schema
psql -h localhost -p 5432 -U postgres -d postgres -f backend/pkg/databases/schema.sql
```

---

#### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Copy environment template if not already done
cp .env.example .env

# Download Go module dependencies
go mod download

# Run the server
go run app/main.go
```

The Go server will start listening at `http://localhost:3000`.

---

#### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Copy environment template if not already done
cp .env.example .env

# Install npm dependencies
npm install

# Start the Vite development server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## Building for Production

### Frontend Production Build

```bash
cd frontend
npm run build
```

The compiled, minified bundle will be generated inside the `frontend/dist/` directory.

### Backend Production Binary

```bash
cd backend
go build -ldflags="-s -w" -o bin/server app/main.go
```

---
