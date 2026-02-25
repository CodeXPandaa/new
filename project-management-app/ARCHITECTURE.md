# System Architecture & Data Flow

## 🏗 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│                      React.js Frontend                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Login      │  │  Dashboard   │  │   Project    │           │
│  │   Page       │  │   (Student/  │  │   Details    │           │
│  │              │  │   Teacher)   │  │   Page       │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                          ▼                                       │
│                  ┌────────────────┐                              │
│                  │  Auth Context  │                              │
│                  │  (JWT Token)   │                              │
│                  └────────────────┘                              │
│                          ▼                                       │
│                  ┌────────────────┐                              │
│                  │  API Service   │                              │
│                  │  (Axios)       │                              │
│                  └────────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
                             │
                    HTTP/HTTPS (port 3000)
                             │
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway                                   │
│              Express.js Server (port 5000)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │              Middleware Layer                          │     │
│  │  - CORS  - JSON Parser  - Auth Verifier  - Error      │     │
│  └────────────────────────────────────────────────────────┘     │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐     │
│  │              Routes Layer                              │     │
│  │  - /auth        - /projects    - /wpr    - /analytics │     │
│  └────────────────────────────────────────────────────────┘     │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐     │
│  │           Controllers Layer                            │     │
│  │  - authController   - projectController               │     │
│  │  - wprController    - analyticsController             │     │
│  └────────────────────────────────────────────────────────┘     │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐     │
│  │           Business Logic & Validation                  │     │
│  │  - Password Hashing  - Progress Calculation           │     │
│  │  - Role Authorization  - Data Validation              │     │
│  └────────────────────────────────────────────────────────┘     │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐     │
│  │              Models (Mongoose)                         │     │
│  │  - User  - Project  - WPR                              │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                             │
                    MongoDB Connection
                             │
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Database                              │
│                  (Local or Atlas)                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Collections:                                                    │
│  ├── users          (Students & Teachers)                       │
│  ├── projects       (All projects)                              │
│  └── wprs           (Weekly Progress Reports)                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagrams

### 1️⃣ Authentication Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ Login/Register
       ▼
┌──────────────────────────┐
│  Frontend Login Form     │
│  ✓ Email                │
│  ✓ Password             │
│  ✓ Role                 │
└──────┬───────────────────┘
       │ POST /auth/login
       ▼
┌──────────────────────────┐
│  Backend Auth Controller │
│  - Find User            │
│  - Verify Password      │
│  - Generate JWT         │
└──────┬───────────────────┘
       │
       ├─→ User Not Found/Password Wrong → 401 Error
       │
       ├─→ Success → Generate JWT Token
       │
       ▼
┌──────────────────────────┐
│  Return User + Token    │
└──────┬───────────────────┘
       │ Store in localStorage
       ▼
┌──────────────────────────┐
│  Redirect to Dashboard   │
│  - Based on Role        │
│  - /student-dashboard   │
│  - /teacher-dashboard   │
└──────────────────────────┘
```

### 2️⃣ Project Request Workflow

```
┌──────────────────┐
│  Student Logs In │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│  Student Dashboard           │
│  - View Projects            │
│  - Request New Project ✓    │
└────────┬─────────────────────┘
         │ Click "Request New Project"
         ▼
┌──────────────────────────────┐
│  Project Request Form        │
│  - Title                     │
│  - Description              │
│  - Team Members (emails)    │
└────────┬─────────────────────┘
         │ Submit
         ▼
┌──────────────────────────────┐
│  POST /projects/request      │
│  Backend Creates Project     │
│  Status: "pending"           │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Teacher Notification        │
│  Pending Approvals Section   │
└────────┬─────────────────────┘
         │ Teacher Approves/Rejects
         ▼
         ├─→ APPROVE
         │   Status: "approved"
         │   Add to students' projects
         │   ▼
         │   ┌─────────────────────┐
         │   │ Appears in Student  │
         │   │ Dashboard & Teacher │
         │   │ Active Projects     │
         │   └─────────────────────┘
         │
         └─→ REJECT
             Status: "rejected"
             Removed from dashboard
             Student Notified
```

### 3️⃣ WPR Submission & Progress Tracking

```
┌──────────────────────────┐
│  Student Views Project   │
│  Progress: 0%            │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Click "Submit WPR"      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  WPR Form                │
│  - Week Number           │
│  - Description           │
│  - File (optional)       │
└────────┬─────────────────┘
         │ Submit
         ▼
┌──────────────────────────┐
│  POST /wpr/submit        │
│  Backend Processing      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Store WPR in DB         │
│  Count WPRs for project  │
└────────┬─────────────────┘
         │ Auto-Calculate Progress
         ▼
┌──────────────────────────┐
│  Progress = WPR Count × 10%
│  (Max 100% at 10+ WPRs)
└────────┬─────────────────┘
         │ Update Project
         ▼
┌──────────────────────────┐
│  Project Progress: 10%   │
│  (After 1st WPR)         │
└────────┬─────────────────┘
         │ Student Sees Updated Progress
         │ Teacher Sees Updated Progress
         │
         ▼
     ┌─────┬─────┬─────┐
     │Week2│Week3│Week4│... (Submit More WPRs)
     └─────┴─────┴─────┘
         │
         ▼
    Progress: 40%
```

### 4️⃣ Teacher Analytics Dashboard

```
┌────────────────────────┐
│  Teacher Logs In       │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│  Teacher Dashboard     │
│  Load Analytics        │
└────────┬───────────────┘
         │ GET /analytics/teacher
         ▼
┌────────────────────────────────────┐
│  Backend Analytics Controller      │
│  - Fetch all projects (guide=me)  │
│  - Calculate stats                 │
│  - Generate chart data            │
└────────┬──────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Analytics Data                    │
│  - Total: 5                        │
│  - Approved: 3                     │
│  - Pending: 1                      │
│  - Completed: 1                    │
│  - Low Progress (< 40%): [...]     │
└────────┬──────────────────────────┘
         │ Return to Frontend
         ▼
┌────────────────────────────────────┐
│  Dashboard Display                 │
│  ┌─────────┐  ┌─────────┐         │
│  │Stats    │  │Charts   │         │
│  │Cards    │  │(Recharts)│        │
│  └─────────┘  └─────────┘         │
│  ┌──────────────────────────────┐ │
│  │Pending Approvals             │ │
│  │[Project List]                │ │
│  │[Approve/Reject Buttons]      │ │
│  └──────────────────────────────┘ │
│  ┌──────────────────────────────┐ │
│  │Active Projects               │ │
│  │[Project Cards with Progress] │ │
│  └──────────────────────────────┘ │
└────────────────────────────────────┘
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Security Layers                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Layer 1: Frontend                                      │
│  ├─ ProtectedRoute Component                           │
│  ├─ Token stored in localStorage                       │
│  ├─ Role-based route redirects                         │
│  └─ Auto-logout on token expiry                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Layer 2: Transmission                                  │
│  ├─ HTTPS (SSL/TLS in production)                      │
│  ├─ Authorization header with Bearer token             │
│  ├─ CORS validation                                    │
│  └─ Request/Response encryption                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Layer 3: Backend Middleware                           │
│  ├─ JWT Verification (auth.js)                         │
│  ├─ Role Authorization (authorize middleware)          │
│  ├─ Request Validation                                 │
│  └─ Rate Limiting (optional)                           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Layer 4: Data Protection                              │
│  ├─ Password Hashing (bcryptjs)                        │
│  ├─ Database User Isolation                            │
│  ├─ Mongoose Schema Validation                         │
│  └─ Role-based Data Access                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📱 Component Hierarchy

```
App
├── Router
│   ├── /login → Login Component
│   │   ├── Register Form
│   │   └── Login Form
│   │
│   ├── /student-dashboard → ProtectedRoute (role: student)
│   │   └── StudentDashboard
│   │       ├── Navbar
│   │       ├── ProjectRequestForm
│   │       └── ProjectGrid
│   │           └── ProjectCard (multiple)
│   │
│   ├── /teacher-dashboard → ProtectedRoute (role: teacher)
│   │   └── TeacherDashboard
│   │       ├── Navbar
│   │       ├── StatCards (4x)
│   │       ├── ChartContainer
│   │       │   ├── PieChart (status)
│   │       │   └── BarChart (semester)
│   │       ├── PendingApprovalsSection
│   │       │   └── ProjectCards (approval actions)
│   │       └── ActiveProjectsSection
│   │           └── ProjectCards
│   │
│   └── /project/:id → ProtectedRoute
│       └── ProjectDetails
│           ├── ProjectInfo
│           ├── ProgressBar
│           ├── WPRSubmissionForm
│           └── WPRHistory
│               └── WPRCard (multiple)
│
└── AuthContext
    ├── user (state)
    ├── token (state)
    ├── login (method)
    └── logout (method)
```

---

## 🗄 Database Schema Relationships

```
┌──────────────────────────────────────────────────────┐
│                 MongoDB Collections                   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  users                                               │
│  ┌────────────────────────────────────────────┐     │
│  │ _id (ObjectId)                             │     │
│  │ name (String)                              │     │
│  │ email (String) - UNIQUE                    │     │
│  │ password (String - hashed)                 │     │
│  │ role (String) - student/teacher            │     │
│  │ semester (Number - optional)               │     │
│  │ department (String - optional)             │     │
│  │ projects: [ObjectId]  ─────────────────┐  │     │
│  │ createdAt (Date)                       │  │     │
│  └────────────────────────────────────────┼──┘     │
│                                           │         │
│                                           │ ref to  │
│                                           │         │
│  projects                                 │         │
│  ┌───────────────────────────────────────┼─────┐   │
│  │ _id (ObjectId)                        │     │   │
│  │ title (String)                        │     │   │
│  │ description (String)                  │     │   │
│  │ guide (ObjectId) ──────────┐          │     │   │
│  │ students: [ObjectId] ◄─────┴──────────┘     │   │
│  │ semester (Number)                     ◄─────┼───┤ ref to projects
│  │ status (String)                       │     │   │
│  │ progress (Number) ──┐                 │     │   │
│  │ startDate (Date)    │                 │     │   │
│  │ endDate (Date)      │                 │     │   │
│  │ createdAt (Date)    │                 │     │   │
│  │ updatedAt (Date)    │                 │     │   │
│  └───────────────────┼─────────────────────────┘   │
│                      │                              │
│                      │ ref to                       │
│                      │                              │
│  wprs                │                              │
│  ┌──────────────────┼──────────────────────┐       │
│  │ _id (ObjectId)   │                      │       │
│  │ project (ObjectId)◄──────────────────────┘       │
│  │ weekNumber (Number)                     │       │
│  │ progressDescription (String)            │       │
│  │ submittedBy (ObjectId) ────┐            │       │
│  │ file (String)              │            │       │
│  │ date (Date)                │            │       │
│  └────────────────────────────┼────────────┘       │
│                               │                    │
│                        ref to users               │
│                                                   │
└──────────────────────────────────────────────────┘

Relationships:
- users.projects → projects._id (One-to-Many)
- projects.guide → users._id (Many-to-One)
- projects.students → users._id (Many-to-Many)
- wprs.project → projects._id (Many-to-One)
- wprs.submittedBy → users._id (Many-to-One)
```

---

## 🔄 Request/Response Flow Example

### Example: Student Submits WPR

```
CLIENT                              SERVER                              DATABASE
  │                                   │                                    │
  ├─ POST /api/wpr/projectId/submit   │                                    │
  │  (with token & WPR data)          │                                    │
  ├──────────────────────────────────>│                                    │
  │                                   │                                    │
  │                                   ├─ Verify JWT Token                 │
  │                                   │                                    │
  │                                   ├─ Check User Role (student)        │
  │                                   │                                    │
  │                                   ├─ Validate Project Ownership       │
  │                                   │                                    │
  │                                   ├─ Create WPR Document              │
  │                                   ├───────────────────────────────────>│
  │                                   │     INSERT INTO wprs               │
  │                                   │     { project, weekNumber, ...}    │
  │                                   │<───────────────────────────────────┤
  │                                   │     Success (wprId)                │
  │                                   │                                    │
  │                                   ├─ Count WPRs for project           │
  │                                   ├───────────────────────────────────>│
  │                                   │     FIND {project: projectId}      │
  │                                   │<───────────────────────────────────┤
  │                                   │     Count: 3                       │
  │                                   │                                    │
  │                                   ├─ Calculate Progress (3 × 10 = 30%) │
  │                                   │                                    │
  │                                   ├─ Update Project Progress           │
  │                                   ├───────────────────────────────────>│
  │                                   │     UPDATE projects                │
  │                                   │     SET progress = 30              │
  │                                   │<───────────────────────────────────┤
  │                                   │     Success                        │
  │                                   │                                    │
  │<──────────────────────────────────┤                                    │
  │  201 Created                      │                                    │
  │  { wpr data + success message}    │                                    │
  │                                   │                                    │
  ├─ Update UI (Progress: 30%)        │                                    │
  │                                   │                                    │
```

---

## 📊 Progress Calculation Logic

```
Algorithm: Auto-Progress Calculation

Input: New WPR submitted by student
Output: Updated project progress

Steps:
1. Create and save new WPR document
   └─ WPR stored in database

2. Count total WPRs for project
   └─ Query: db.wprs.find({project: projectId}).count()

3. Calculate progress
   ├─ If count <= 10:
   │  └─ progress = count × 10%
   └─ If count > 10:
      └─ progress = 100% (capped)

4. Update project progress field
   └─ db.projects.updateOne(
        {_id: projectId},
        {progress: calculatedProgress}
      )

5. Return success response

Example Progression:
- 0 WPRs → 0%
- 1 WPR  → 10%
- 2 WPRs → 20%
- 3 WPRs → 30%
- ...
- 10 WPRs → 100%
- 11+ WPRs → 100% (capped)
```

---

## 🎯 State Management Flow

```
Frontend State:

AuthContext
├── user
│   ├── id
│   ├── name
│   ├── email
│   ├── role (student/teacher)
│   └── semester
├── token (JWT)
├── loading (boolean)
└── Methods:
    ├── login(userData, token)
    ├── logout()
    └── (stored in localStorage)

Component States:
├── StudentDashboard
│   ├── projects[] (fetched)
│   ├── showRequestForm (boolean)
│   ├── formData (title, description, teamMembers)
│   └── loading (boolean)
├── TeacherDashboard
│   ├── projects[] (fetched)
│   ├── analytics {} (stats data)
│   └── loading (boolean)
└── ProjectDetails
    ├── project {} (fetched)
    ├── wprs[] (fetched)
    ├── showWPRForm (boolean)
    ├── wprData (weekNumber, description, file)
    └── loading (boolean)
```

---

This architecture provides:
✅ Clear separation of concerns
✅ Scalable structure
✅ Security at multiple layers
✅ Efficient data flow
✅ Easy to maintain and extend

Happy Building! 🚀
