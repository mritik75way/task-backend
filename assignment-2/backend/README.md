# 📄 Document Versioning System

This repository contains a **Backend (API)** and for a document editor with version history, rich-text editing, and side-by-side diff comparison.

---

# 🖥 Backend – API

## 🚀 Features

* Create and store document versions
* Auto-increment version numbers per document
* Fetch latest document version
* Fetch all versions (version + timestamp)
* Fetch a specific version by number
* Rollback to any previous version (creates a new version)
* Delete a document **along with all its version history**

---

## 🛠 Tech Stack

* Node.js
* Express
* MongoDB
* Mongoose
* TypeScript

---

## 📦 Installation

```bash
git clone <repo-url>
cd backend
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/document_versioning
```

---

## ▶️ Run Server

```bash
npm run dev
```

Server runs on:

```
http://localhost:4000
```

---

## 📌 API Endpoints

### Save New Version

```http
POST /versions/:id/save
```

Body:

```json
{
  "content": { "type": "doc", "content": [] }
}
```

---

### Get Latest Version

```http
GET /versions/:id/latest
```

---

### Get All Versions

```http
GET /versions/:id
```

Response:

```json
[
  { "version": 3, "createdAt": "2024-01-01" }
]
```

---

### Get Version by Number

```http
GET /versions/:id/:version
```

---

### Rollback to Version

```http
POST /versions/:id/:version/rollback
```

Creates a **new version** using the selected version’s content.

---

### Delete Document + History

```http
DELETE /documents/:id
```

Deletes the document and **all associated versions**.

---
