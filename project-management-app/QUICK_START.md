# Quick Start Guide - Project Management App

## 📦 What's Included

✅ Complete React Frontend with:
- Login/Register page
- Student Dashboard (request projects)
- Teacher Dashboard (approval & analytics)
- Project Details page (WPR submission)
- Role-based route protection
- Tailwind CSS styling

✅ Complete Node.js/Express Backend with:
- User authentication (JWT)
- Project management endpoints
- Weekly Progress Report (WPR) system
- Analytics dashboard API
- MongoDB schemas for all entities
- Role-based authorization middleware

---

## 🚀 Installation Steps

### Step 1: Install Backend Dependencies

```bash
cd project-management-app/backend
npm install
```

### Step 2: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 3: Setup Environment Variables

**Backend (.env)**:
```bash
cd backend
echo "PORT=5000" > .env
echo "MONGODB_URI=mongodb://localhost:27017/project-management" >> .env
echo "JWT_SECRET=your-secret-key-change-this" >> .env
echo "NODE_ENV=development" >> .env
```

**Frontend (.env)**:
```bash
cd ../frontend
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### Step 4: Install and Start MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition (if not installed)
# Then run:
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `MONGODB_URI` in backend/.env

### Step 5: Start Backend Server

```bash
cd backend
npm run dev
```

You should see: `Server running on port 5000`

### Step 6: Start Frontend (New Terminal)

```bash
cd frontend
npm start
```

Browser will open: `http://localhost:3000`

---

## 🎯 Test the App

### 1. Register as Teacher
- Go to http://localhost:3000
- Click "Create Account"
- Email: `teacher@example.com`
- Password: `password123`
- Role: Select "Teacher"
- Click Register

### 2. Register as Student (New Browser Tab/Window)
- Email: `student@example.com`
- Password: `password123`
- Role: Select "Student"
- Semester: 4
- Department: CSE
- Click Register

### 3. Student Action
- Login with student@example.com
- Click "Request New Project"
- Title: "AI Chatbot"
- Description: "Build an intelligent chatbot"
- Click Submit

### 4. Teacher Action
- Login with teacher@example.com
- See "Pending Approvals" section
- Click "Approve" button
- Project moves to "Active Projects"

### 5. Student WPR Submission
- Go back to student account
- Click on the AI Chatbot project
- Click "Submit WPR"
- Week Number: 1
- Description: "Completed NLP research"
- Click Submit
- See progress increase to 10%

### 6. View Analytics
- Logout and login as teacher
- See dashboard with:
  - Total projects count
  - Status distribution pie chart
  - Projects per semester bar chart
  - Low-progress project alerts

---

## 🔑 Key API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me (requires token)
```

### Projects
```
POST /api/projects/request (student)
GET /api/projects/student (student)
GET /api/projects/teacher (teacher)
GET /api/projects/:id (both)
POST /api/projects/:id/approve (teacher)
POST /api/projects/:id/reject (teacher)
PATCH /api/projects/:id/progress (teacher)
```

### WPR
```
POST /api/wpr/:projectId/submit (student)
GET /api/wpr/:projectId (both)
```

### Analytics
```
GET /api/analytics/teacher (teacher)
GET /api/analytics/student/:studentId (both)
```

---

## 📊 Database Schema

### Users Collection
- Name, Email, Password (hashed)
- Role (student/teacher)
- Semester, Department (for students)
- Projects array (references)

### Projects Collection
- Title, Description
- Guide (teacher reference)
- Students (array of student references)
- Status (pending/approved/rejected/completed)
- Progress (0-100%)
- Dates (start, end)

### WPR Collection
- Project reference
- Week Number
- Description
- Submitted By (student)
- File (upload)
- Date

---

## 🎨 Frontend Features

### Login Page
- Login/Register toggle
- Role selection (Student/Teacher)
- Form validation
- Error handling

### Student Dashboard
- View all projects
- Request new project
- Progress bars
- Quick project access

### Teacher Dashboard
- Analytics cards
- Pie chart (project status)
- Bar chart (semester distribution)
- Pending approvals
- Active projects list

### Project Details
- Project info
- Progress tracking
- WPR submission form
- WPR history
- File downloads

---

## 🔐 Security Features

✅ JWT Authentication (30-day expiry)
✅ Password hashing with bcryptjs
✅ Role-based access control
✅ Protected routes
✅ Request validation
✅ CORS enabled

---

## 📈 Progress Calculation

Default: 10% per WPR submitted
- 1 WPR = 10%
- 2 WPR = 20%
- ...
- 10+ WPR = 100%

To customize, edit `backend/src/controllers/wprController.js`:
```javascript
// Line in submitWPR function:
const newProgress = Math.min(wprCount * 10, 100);
```

---

## 🐛 Common Issues & Solutions

### MongoDB Connection Failed
```
Solution: Make sure MongoDB is running (mongod command)
Or update MONGODB_URI to Atlas connection string
```

### CORS Error
```
Solution: Already configured in backend
If error persists, check frontend URL in server.js
```

### Port Already in Use
```
Solution: Kill process or change PORT in .env
netstat -lntp | grep 5000  (then kill PID)
```

### Token Errors
```
Solution: Clear localStorage and login again
In browser console: localStorage.clear()
```

---

## 📁 Project Structure Summary

```
project-management-app/
├── frontend/
│   ├── src/
│   │   ├── pages/ (Login, Dashboards, ProjectDetails)
│   │   ├── components/ (ProtectedRoute)
│   │   ├── context/ (AuthContext)
│   │   ├── services/ (API calls)
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
└── backend/
    ├── src/
    │   ├── models/ (User, Project, WPR)
    │   ├── controllers/ (Auth, Projects, WPR, Analytics)
    │   ├── routes/ (All API endpoints)
    │   ├── middleware/ (Auth protection)
    │   ├── utils/ (JWT helper)
    │   └── server.js
    ├── package.json
    └── .env
```

---

## 🚀 Next Steps

1. **Production Deployment**
   - Deploy backend to Heroku/Railway
   - Deploy frontend to Vercel/Netlify
   - Update REACT_APP_API_URL to production server

2. **Database Backups**
   - Enable MongoDB backup if using Atlas
   - Regular backup scripts for local MongoDB

3. **Additional Features**
   - File upload to AWS S3
   - Email notifications (SendGrid/Nodemailer)
   - Plagiarism checker integration
   - Viva marks entry
   - Admin panel for multiple colleges

4. **Testing**
   - Add Jest tests for backend
   - Add RTL tests for frontend
   - Load testing with k6/Artillery

5. **Monitoring**
   - Add logging (Winston/Morgan)
   - Error tracking (Sentry)
   - Performance monitoring

---

## 📞 Support

For detailed documentation, see main README.md

Happy building! 🔥 CodeXPandaa
