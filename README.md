# 🚀 UltraPDF: Production-Ready Full-Stack PDF Compressor

A high-performance, secure, full-stack web application designed to compress PDF documents efficiently using a robust Ghostscript backend engine wrapped in a clean, responsive React and Tailwind CSS user interface. Built with enterprise-grade security practices, including magic-byte validation, path traversal defense, and automated memory/disk lifecycle management.

---

## 🛠️ Tech Stack

### Frontend

- **React** with **Vite** for lightning-fast builds
- **TypeScript** for end-to-end type safety
- **Tailwind CSS** for modern, fully responsive UI design

### Backend

- **Node.js** & **Express** with **TypeScript**
- **Ghostscript** (`child_process.execFile`) for high-fidelity PDF stream optimization
- **Multer** for secure, streamed file uploads

### Infrastructure & Security

- **Docker & Docker Alpine** containerization
- **Magic-Byte Verification** for deep binary header validation (`%PDF-`)
- **Rate Limiting** (`express-rate-limit`) to prevent resource exhaustion and brute-force attacks
- **Path Traversal Protection** via strict UUID parameter sanitization

---

## ✨ Key Features

- **Granular Compression Toggles**: Choose between _Extreme_, _Recommended_, and _Low_ compression profiles based on visual quality vs. size requirements.
- **Zero Disk Bloat**: Immediate cleanup of original upload buffers post-processing, paired with a background retention vacuum enforcing a strict 15-minute file lifecycle.
- **Robust Security Guards**: Rejects malicious executables or scripts disguised with a `.pdf` extension before they ever touch the processing pipeline.
- **Sleek Mobile-First UX**: Built-in loading spinners, dynamic error states, and responsive layout scaling for all screen sizes.

---

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js** (v18 or higher)
- **Ghostscript** installed on your system (with the `\bin` directory added to your OS System PATH)

### 1. Clone the Repository

```bash
git clone [https://github.com/Shreyyaa17/pdf-compressor.git](https://github.com/YOUR_USERNAME/pdf-compressor.git)
cd pdf-compressor
```

## 🚀 Getting Started Locally

### 2. Backend Setup

```bash
cd server
npm install
npm run dev
```

The backend server starts on http://localhost:5000.

### 3. Frontend Setup

Open a separate terminal window:

```bash
cd client
npm install
npm run dev
```

The frontend application starts on http://localhost:5173.

## 🐳 Running with Docker

To spin up the backend inside an isolated container with Ghostscript pre-configured:

```bash
cd server
docker build -t pdf-compressor-backend .
docker run -p 5000:5000 pdf-compressor-backend
```

## 📂 Project Architecture

```text
pdf-compressor/
├── client/                 # React + Vite + Tailwind Frontend
│   └── src/
│       └── components/     # FileUploader & Interactive UI states
├── server/                 # Node.js + Express Backend
│   ├── src/
│   │   ├── middleware/     # Rate limiters & Upload validation
│   │   ├── routes/         # Compress & Secure Download endpoints
│   │   ├── services/       # Ghostscript binary execution wrapper
│   │   └── utilities/      # File cleanup vacuum & Magic-byte checker
│   ├── Dockerfile          # Production container setup
│   └── package.json
└── .gitignore
```
