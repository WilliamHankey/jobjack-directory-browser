# JOBJACK Directory Browser Assessment

> Technical assessment implementing a secure, scalable directory browser using **Angular 18**, **Node.js**, **GraphQL**, **PrimeNG**, and **Docker**.

---

# Overview

This application allows a user to browse the local filesystem exposed by the backend.

The client communicates with a GraphQL API that safely reads directories inside an allowed root folder and returns paginated filesystem information.

The application supports:

- Browse directories
- Navigate into folders
- View file metadata
- Differentiate files and directories
- Responsive desktop and mobile layouts
- Large directory support (100,000+ files)
- Docker containerisation

---

# Technology Stack

## Frontend

- Angular 18
- TypeScript
- PrimeNG 18
- Apollo Angular
- GraphQL
- SCSS
- Angular Signals

## Backend

- Node.js
- TypeScript
- Apollo Server
- GraphQL
- Node File System API (`fs/promises`)
- Async Directory Iteration

## Infrastructure

- Docker
- Docker Compose

---

# Architecture

```
Angular 18
│
├── Apollo Angular
│
└── GraphQL
        │
        ▼
Node.js API
        │
        ▼
Directory Service
        │
        ▼
Node File System
```

The frontend is completely decoupled from the filesystem implementation.

Only the GraphQL API communicates with the operating system.

---

# Folder Structure

```
.
├── api
│   ├── src
│   │   ├── graphql
│   │   ├── services
│   │   ├── utils
│   │   └── server.ts
│   │
│   └── Dockerfile
│
├── client
│   └── src
│       └── app
│           ├── core
│           ├── features
│           │   └── directory-browser
│           │       ├── data-access
│           │       ├── models
│           │       ├── pages
│           │       ├── state
│           │       ├── ui
│           │       └── shared
│           │
│           └── app.routes.ts
│
├── sample-files
│
└── docker-compose.yml
```

---

# Angular Architecture

The Angular application follows a **feature-first architecture**.

```
directory-browser
│
├── data-access
│
├── pages
│
├── state
│
├── ui
│
└── shared
```

## data-access

Contains all GraphQL queries and services.

Responsibilities:

- Apollo communication
- GraphQL queries
- API abstraction

---

## state

Contains feature state.

Responsibilities:

- Signals
- Derived state
- UI state
- Pagination state

---

## ui

Contains presentational components.

Examples:

- Table
- Breadcrumb
- Statistics
- Loading state
- Empty state
- Mobile list

These components contain little to no business logic.

---

## pages

Responsible for composing the feature.

The page coordinates:

- state
- data loading
- navigation
- UI components

---

## shared

Contains reusable feature utilities.

---

# Backend Architecture

The backend follows a layered architecture.

```
GraphQL Resolver

        │

        ▼

Directory Service

        │

        ▼

File System
```

## GraphQL Resolver

Responsible for:

- receiving GraphQL requests
- validation
- delegating to services

Business logic is intentionally kept out of the resolver.

---

## Directory Service

Responsible for:

- reading directories
- pagination
- file metadata
- permission mapping
- cursor generation

---

## Utilities

Responsible for:

- path validation
- filesystem helpers
- reusable utilities

---

# GraphQL

Example query:

```graphql
query DirectoryListing($path: String, $first: Int!, $after: String) {
  directoryListing(
    path: $path
    first: $first
    after: $after
  ) {
    currentPath

    totalReturned

    edges {
      cursor

      node {
        name
        fullPath
        size
        extension
        createdAt
        permissions
        type
        isDirectory
      }
    }

    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

---

# Large Directory Support

The assessment specifies support for directories containing at least **100,000 files**.

Returning every file at once would:

- consume excessive memory
- block the event loop
- create very large responses
- significantly slow down the browser

Instead this implementation uses:

- async directory iteration
- cursor pagination
- incremental loading

This keeps memory usage predictable while allowing users to continue browsing large directories efficiently.

---

# Security

The backend does **not** expose the entire filesystem.

Only a configured root directory can be accessed.

Example:

```
ALLOWED_ROOT=/app/shared
```

Path traversal attacks are prevented by resolving and validating requested paths before accessing the filesystem.

Examples of blocked requests:

```
../../Windows
```

```
../../../etc
```

```
C:\Windows
```

---

# Running Locally

## Requirements

- Node.js 22+
- npm
- Docker Desktop (optional)

---

## 1. Clone

```
git clone <repository-url>

cd directory-browser-assessment
```

---

## 2. Install API

```
cd api

npm install
```

---

## 3. Install Client

```
cd ../client

npm install
```

---

## 4. Run API

```
cd ../api

npm run dev
```

Runs on

```
http://localhost:4000
```

---

## 5. Run Client

```
cd ../client

npm start
```

Runs on

```
http://localhost:4200
```

---

# Running with Docker

```
docker compose up --build
```

Client:

```
http://localhost:4200
```

GraphQL API:

```
http://localhost:4000
```

---

# Sample Files

The repository contains a `sample-files` directory used during development.

Docker mounts this folder into the API container.

Only this folder can be browsed.

---

# Design Decisions

## Why GraphQL?

JOBJACK primarily uses GraphQL.

Using GraphQL provides:

- strongly typed contracts
- reduced over-fetching
- flexible queries
- improved client/server separation

---

## Why Angular Signals?

Signals provide simple reactive local state while keeping templates declarative and reducing manual subscriptions.

---

## Why Async Directory Iteration?

Using

```
fs.opendir()
```

with

```
for await (...)
```

avoids reading an entire directory into memory before processing.

---

## Why Cursor Pagination?

Cursor pagination scales significantly better than page-number pagination for very large collections.

It also aligns well with GraphQL best practices.

---

## Why a Feature-First Angular Structure?

Grouping files by feature improves maintainability compared to grouping by file type.

Each feature owns:

- state
- services
- components
- utilities

making future enhancements easier to implement.

---

# Future Improvements

If this application were to move into production, the next improvements would include:

- Sorting
- Server-side filtering
- Search
- Virtual scrolling
- File icons by MIME type
- Breadcrumb history
- Unit tests
- Integration tests
- End-to-end tests
- GraphQL Code Generator
- Request logging
- Rate limiting
- Authentication & authorization

---

# Author

William Hankey

Technical Assessment for JOBJACK