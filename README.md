# 🌊 OceanAI Authoring Platform

An AI-powered document authoring platform to generate, edit, and export **Word (.docx)** and **PowerPoint (.pptx)** documents using modern full-stack architecture.

---

##  Features

 User authentication (register & login)  
 Create Word / PowerPoint projects  
 AI-generated content per section  
 AI section refinement  
 Like / Dislike feedback system  
 User comments per section  
 Manual outline customization  
 Export to **.docx** and **.pptx**  
 Swagger API documentation  

---

##  Tech Stack

### Frontend:
- React (Vite)
- Tailwind CSS
- React Router

### Backend:
- FastAPI
- SQLAlchemy
- SQLite
- JWT Authentication

---

## 🗂 Project Structure

oceanai-authoring/
│
├── backend/
│ ├── app/
│ │ ├── main.py
│ │ ├── database.py
│ │ ├── models.py
│ │ ├── auth.py
│ │ └── routes/
│ │ ├── content_routes.py
│ │ └── project_routes.py
│
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── vite.config.js
│
└── README.md

yaml
Copy code

---

##  Environment Variables

Create a `.env` file inside `backend/`:

```env
SECRET_KEY=super_secret_key
DATABASE_URL=sqlite:///./database.db
For production (Render):

env
Copy code
DATABASE_URL=sqlite:////tmp/database.db
 Backend Setup
Step 1: Go to backend folder
bash
Copy code
cd backend
Step 2: Create and activate virtual environment
Windows:

bash
Copy code
python -m venv .venv
.venv\Scripts\activate
Mac/Linux:

bash
Copy code
python -m venv .venv
source .venv/bin/activate
Step 3: Install dependencies
bash
Copy code
pip install -r requirements.txt
If requirements.txt doesn't exist:

bash
Copy code
pip freeze > requirements.txt
pip install -r requirements.txt
Step 4: Run Backend Server
bash
Copy code
uvicorn app.main:app --reload
Backend will run on:

cpp
Copy code
http://127.0.0.1:8000
Swagger API:

arduino
Copy code
http://127.0.0.1:8000/docs
🌐 Frontend Setup
Step 1: Go to frontend folder
bash
Copy code
cd frontend
Step 2: Install dependencies
bash
Copy code
npm install
Step 3: Start frontend
bash
Copy code
npm run dev
Frontend will run at:

arduino
Copy code
http://localhost:5173
🔗 Backend API URL Configuration
In frontend folder, open:

bash
Copy code
src/api/api.js
Update:

js
Copy code
baseURL: "http://127.0.0.1:8000"
When deployed, change to:

js
Copy code
baseURL: "https://your-backend-url.onrender.com"
🧪 How to Use
1️⃣ Register User
Visit Swagger:

arduino
Copy code
http://127.0.0.1:8000/docs
Call:

arduino
Copy code
POST /auth/register
2️⃣ Login
Login from:

arduino
Copy code
http://localhost:5173
3️⃣ Create New Project
Go to Dashboard

Click New Project

Enter Title & Topic

Add/Edit custom outline

Click Create Project

4️⃣ Generate Content
Inside project:

Click Generate Content

AI will create content into sections

5️⃣ Refinement
For each section:
✔ Add instruction
✔ Click Refine AI
✔ Use Like / Dislike buttons
✔ Add comments

6️⃣ Export
Click:
✅ Download DOCX
✅ Download PPTX
