# Project Introduction 

This project is a backend service built with **FastAPI** and **Backblaze B2** as cloud storage. It allows users to upload, store, and share files securely.


---

## How to Run the Project

### Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### Create and activate a virtual environment

```bash
python -m venv venv
source venv/bin/activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Set environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:1234@localhost:5432/storage_db
SECRET_KEY=CHANGE_THIS_SECRET
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

STORAGE_BACKEND=b2
B2_ACCESS_KEY=
B2_SECRET_KEY=
B2_BUCKET=
B2_ENDPOINT=
```

### Run the application

```bash
uvicorn app.main:app --reload
```

### Open API documentation

Visit:

```
http://localhost:8000/docs
```

---

## Authentication Overview

This project uses **JWT-based authentication** to secure protected APIs.

**Flow:**

* User logs in via the authentication endpoint
* Backend issues a JWT access token
* Client sends the token with each request:

  ```
  Authorization: Bearer <access_token>
  ```
* FastAPI dependencies validate the token and identify the current user

Only authenticated users can upload, list, download, or share files.

---

## Core File Flow

### 1. File Upload (`POST /files/upload`)

* Authenticated user uploads a file
* Backend validates user and file size
* File is stored in Backblaze B2
* Only metadata (name, size, owner, path) is stored in the database

### 2. List Files (`GET /files`)

* User requests their file list
* Backend fetches metadata from the database
* Supports search, pagination, and folder filtering

### 3. File Download (`GET /files/{file_id}/download`)

* Backend verifies file ownership
* Backend generates a **signed URL**
* Client downloads the file directly from cloud storage

### 4. Public File Sharing

* Owner generates a share token via `/files/{file_id}/share`
* Public endpoint `/share/{token}` issues a signed URL
* No authentication required for public access
* Token is stored with file metadata

> Files are never streamed through the backend.

---

## Storage Overview

* Files are stored in a **private cloud bucket**
* Backend never exposes direct bucket access
* All downloads use **time-limited signed URLs**

### Storage Flow

* Backend receives upload request
* File is uploaded to the configured storage provider
* Storage returns file location
* Backend stores metadata in the database

### Cloud Integration

* Backblaze B2 (S3-compatible API)
* Private bucket only
* Signed URLs for secure access
* Storage logic is abstracted and switchable


## Key Design Notes

* Backend handles **authorization and metadata only**
* Cloud storage handles **actual file transfer**

