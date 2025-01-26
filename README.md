# **Rememberify**

**Rememberify** is your second brain! This app helps you quickly jot down important data, links, ideas, and now even photos, making it super easy to organize and retrieve your thoughts whenever you need them.

---

## **Features**
- Save links and ideas effortlessly.
- Upload and store photos securely.
- Organize data for quick and intuitive access.
- Simple and user-friendly design.
- Share your "second brain" with others seamlessly.

---

## **Tech Stack**
- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, TypeScript, Express
- **Database:** MongoDB
- **Cloud Storage:** Cloudinary

---

## **Setup Instructions**

### 1. **Clone the Repository**
```bash
git clone https://github.com/rahmanfaizur/rememberify-main.git
cd rememberify-main
```

### 2. **Set Up the Environment Variables**

#### **Frontend:**
Navigate to the `frontend` directory and create a `.env` file:
```bash
cd frontend
touch .env
```
Add the following variable:
```env
VITE_BACKEND_URL=<your-backend-url>
```

#### **Backend:**
Navigate to the `backend` directory and create a `.env` file:
```bash
cd ../backend
touch .env
```
Add the following variables:
```env
JWT_PASS=<your-jwt-secret>
MONGO_URL=<your-mongodb-url>
CLOUD_NAME=<your-cloudinary-cloud-name>
API_KEY=<your-cloudinary-api-key>
API_SECRET=<your-cloudinary-api-secret>
```

---

### 3. **Install Dependencies**

#### Frontend:
```bash
cd frontend
npm install
```

#### Backend:
```bash
cd ../backend
npm install
```

Add the following scripts to the `package.json` file in the backend:
```json
"scripts": {
  "build": "tsc -b",
  "start": "node dist/index.js",
  "dev": "npm run build && npm run start"
}
```

---

### 4. **Run the App**

#### Frontend:
```bash
cd frontend
npm run dev
```
Access the frontend at [http://localhost:5173](http://localhost:5173).

#### Backend:
```bash
cd ../backend
npm run dev
```
The backend runs on [http://localhost:3000](http://localhost:3000).

---

## **Contributing**
Contributions are always welcome!

---

## **License**
[MIT License](LICENSE)
