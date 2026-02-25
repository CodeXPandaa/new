# Project Management Web App

A comprehensive project management platform for teachers and students with role-based access, project tracking, weekly progress reports, and analytics dashboard.

## 🚀 Features

### For Students
- ✅ Request projects with team members
- ✅ View assigned projects
- ✅ Submit weekly progress reports (WPR)
- ✅ Track project progress percentage
- ✅ Upload project files and documentation

### For Teachers
- ✅ Approve/Reject project requests
- ✅ Track student project progress
- ✅ View analytics dashboard with charts
- ✅ Monitor low-progress projects
- ✅ Semester-wise project statistics

### General Features
- ✅ Role-based authentication (JWT)
- ✅ Group projects (multiple students per project)
- ✅ Auto progress calculation based on WPR submissions
- ✅ Responsive UI with Tailwind CSS
- ✅ Real-time analytics with charts

## 📁 Project Structure

```
project-management-app/
├── frontend/                    # React.js Frontend
│   ├── src/
│   │   ├── pages/              # Login, Dashboard, ProjectDetails
│   │   ├── components/         # Reusable components
│   │   ├── context/            # Auth context
│   │   ├── services/           # API calls
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
│
└── backend/                     # Node.js/Express Backend
    ├── src/
    │   ├── models/             # Mongoose schemas
    │   ├── controllers/        # Business logic
    │   ├── routes/             # API endpoints
    │   ├── middleware/         # Auth middleware
    │   ├── utils/              # Helper functions
    │   └── server.js
    ├── package.json
    └── .env
```

## 🛠 Tech Stack

### Frontend
- React 18+
- React Router v6
- Axios
- Tailwind CSS
- Recharts (for analytics)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud Atlas)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone and Setup Backend

```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project-management
JWT_SECRET=your-secret-key-change-this
NODE_ENV=development
```

Start MongoDB:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in .env)
```

Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env` file in frontend folder:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📚 Database Schemas

### User
```javascript
{
  _id, name, email, password (hashed),
  role: "student" | "teacher",
  semester (for students),
  department (for students),
  projects: [projectId],
  createdAt
}
```

### Project
```javascript
{
  _id, title, description,
  guide: teacherId,
  students: [studentId],
  semester,
  status: "pending" | "approved" | "rejected" | "completed",
  progress: 0-100,
  startDate, endDate,
  createdAt, updatedAt
}
```

### WPR (Weekly Progress Report)
```javascript
{
  _id,
  project: projectId,
  weekNumber,
  progressDescription,
  submittedBy: studentId,
  file: fileUrl,
  date
}
```

## 🔐 Authentication Flow

### Registration
1. User signs up with email, password, role, and optional semester/department
2. Password hashed with bcryptjs
3. JWT token generated and returned

### Login
1. User logs in with email and password
2. Password verified
3. JWT token generated with user data
4. Token stored in localStorage
5. User redirected to dashboard based on role

### Protected Routes
- Student routes require role="student"
- Teacher routes require role="teacher"
- All routes require valid JWT token

## 📊 Workflow

### Step 1: Project Request
1. Student logs in
2. Click "Request New Project"
3. Fill title, description, team members
4. Request sent to teacher (guide)

### Step 2: Teacher Approval
1. Teacher sees pending requests
2. Clicks "Approve" or "Reject"
3. Project status updated
4. Students added to projects array

### Step 3: WPR Submission
1. Student views approved project
2. Click "Submit WPR"
3. Enter week number, description, upload file
4. Progress automatically updated (10% per WPR, max 100%)

### Step 4: Analytics
1. Teacher views dashboard
2. See total, approved, pending, completed projects
3. View charts for project distribution
4. Monitor low-progress projects

## 📊 Progress Calculation

**Default Logic**: 10% per WPR submission
- 1 WPR = 10%
- 2 WPR = 20%
- ...
- 10 WPR = 100%

**Customizable**: Modify in `wprController.js` under `submitWPR` function

Alternative options:
```javascript
// Option 1: Milestone-based
- Synopsis uploaded → 20%
- 5 WPRs → 50%
- Final report → 80%
- Viva completed → 100%

// Option 2: Percentage submission
- Direct teacher input
- Update via PATCH /projects/:id/progress
```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `POST /api/projects/request` - Request new project (student)
- `GET /api/projects/student` - Get student's projects
- `GET /api/projects/teacher` - Get teacher's projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects/:id/approve` - Approve project (teacher)
- `POST /api/projects/:id/reject` - Reject project (teacher)
- `PATCH /api/projects/:id/progress` - Update progress (teacher)

### WPR
- `POST /api/wpr/:projectId/submit` - Submit WPR (student)
- `GET /api/wpr/:projectId` - Get all WPRs for project
- `GET /api/wpr/:projectId/:id` - Get specific WPR

### Analytics
- `GET /api/analytics/teacher` - Teacher dashboard stats
- `GET /api/analytics/student/:studentId` - Student analytics

## 🎨 UI Features

### Login Page
- Role-based login/register
- Form validation
- Error messages

### Student Dashboard
- View all assigned projects
- Request new project
- Progress visualization
- Quick project access

### Teacher Dashboard
- Analytics cards (total, approved, pending, completed)
- Pie chart - Project status distribution
- Bar chart - Projects per semester
- Pending approvals section
- Active projects with progress tracking

### Project Details
- Project information
- Progress bar
- WPR submission form
- WPR history with file downloads
- Team members list

## 🔧 Advanced Features You Can Add

1. **File Upload to AWS S3** - Instead of local storage
2. **Email Notifications** - For approvals, rejections, reminders
3. **Viva Marks Entry** - Teacher can enter viva results
4. **Plagiarism Checker** - Integration with API
5. **Student Profiles** - Full student information
6. **Comments/Discussion** - Between teacher and students
7. **Deadline Reminders** - Auto-notify for WPR deadlines
8. **Project Template** - Pre-defined project types
9. **Export Reports** - PDF/Excel reports
10. **Multi-college Support** - Admin panel for colleges

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Make sure MongoDB is running:
- Local: mongod command
- Atlas: Check connection string in .env
```

### CORS Error
```
Backend CORS already configured for http://localhost:3000
If frontend on different port, update in server.js
```

### Token Expiration
```
Tokens expire in 30 days
Users need to login again after expiration
Can modify in utils/jwt.js
```

### WPR File Upload Issues
```
Currently stores file path
For production, integrate AWS S3 or similar service
```

## 📝 Example Test Cases

### Register Student
```bash
POST /api/auth/register
{
  "name": "Aman Kumar",
  "email": "aman@example.com",
  "password": "password123",
  "role": "student",
  "semester": 4,
  "department": "CSE"
}
```

### Register Teacher
```bash
POST /api/auth/register
{
  "name": "Dr. Smith",
  "email": "smith@example.com",
  "password": "password123",
  "role": "teacher"
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "aman@example.com",
  "password": "password123"
}
```

### Request Project
```bash
POST /api/projects/request
Headers: Authorization: Bearer {token}
{
  "title": "AI Chatbot",
  "description": "Build an intelligent chatbot using NLP",
  "teamMembers": ["priya@example.com"]
}
```

## 📄 License

MIT License - Feel free to use and modify

## 🤝 Contributing

Pull requests welcome! Please follow the existing code structure.

## 👨‍💻 Author

CodeXPandaa - Project Management SaaS

---

**Happy Coding! 🚀**
