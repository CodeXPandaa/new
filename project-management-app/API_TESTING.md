# API Testing Guide - Project Management App

Use this guide to test all API endpoints using cURL or Postman.

## 🔐 Authentication Endpoints

### 1. Register a Student

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aman Kumar",
    "email": "aman@example.com",
    "password": "password123",
    "role": "student",
    "semester": 4,
    "department": "CSE"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "63f7a1b2c5d3e4f5g6h7i8j9",
    "name": "Aman Kumar",
    "email": "aman@example.com",
    "role": "student",
    "semester": 4,
    "department": "CSE"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Register a Teacher

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Smith",
    "email": "smith@example.com",
    "password": "password123",
    "role": "teacher"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "aman@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "63f7a1b2c5d3e4f5g6h7i8j9",
    "name": "Aman Kumar",
    "email": "aman@example.com",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. Get Current User

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📁 Project Endpoints

### 5. Request New Project (Student)

```bash
curl -X POST http://localhost:5000/api/projects/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "AI Chatbot",
    "description": "Build an intelligent chatbot using NLP",
    "teamMembers": ["priya@example.com"]
  }'
```

**Response:**
```json
{
  "_id": "63f7a1b2c5d3e4f5g6h7i8j9",
  "title": "AI Chatbot",
  "description": "Build an intelligent chatbot using NLP",
  "guide": "63f7a1b2c5d3e4f5g6h7i8j0",
  "students": ["63f7a1b2c5d3e4f5g6h7i8j9"],
  "semester": 4,
  "status": "pending",
  "progress": 0,
  "createdAt": "2024-02-25T10:30:00Z"
}
```

### 6. Get Student's Projects

```bash
curl -X GET http://localhost:5000/api/projects/student \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Get Teacher's Projects

```bash
curl -X GET http://localhost:5000/api/projects/teacher \
  -H "Authorization: Bearer TEACHER_TOKEN_HERE"
```

### 8. Get Project Details

```bash
curl -X GET http://localhost:5000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 9. Approve Project (Teacher Only)

```bash
curl -X POST http://localhost:5000/api/projects/PROJECT_ID/approve \
  -H "Authorization: Bearer TEACHER_TOKEN_HERE"
```

### 10. Reject Project (Teacher Only)

```bash
curl -X POST http://localhost:5000/api/projects/PROJECT_ID/reject \
  -H "Authorization: Bearer TEACHER_TOKEN_HERE"
```

### 11. Update Project Progress (Teacher Only)

```bash
curl -X PATCH http://localhost:5000/api/projects/PROJECT_ID/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TEACHER_TOKEN_HERE" \
  -d '{
    "progress": 50
  }'
```

---

## 📊 WPR (Weekly Progress Report) Endpoints

### 12. Submit WPR (Student)

```bash
curl -X POST http://localhost:5000/api/wpr/PROJECT_ID/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer STUDENT_TOKEN_HERE" \
  -d '{
    "weekNumber": 1,
    "progressDescription": "Completed NLP research and started building the chatbot model"
  }'
```

**Response:**
```json
{
  "_id": "63f7a1b2c5d3e4f5g6h7i8j9",
  "project": "63f7a1b2c5d3e4f5g6h7i8j0",
  "weekNumber": 1,
  "progressDescription": "Completed NLP research and started building the chatbot model",
  "submittedBy": {
    "_id": "63f7a1b2c5d3e4f5g6h7i8j9",
    "name": "Aman Kumar",
    "email": "aman@example.com"
  },
  "date": "2024-02-25T10:35:00Z"
}
```

### 13. Get All WPRs for Project

```bash
curl -X GET http://localhost:5000/api/wpr/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 14. Get Specific WPR

```bash
curl -X GET http://localhost:5000/api/wpr/PROJECT_ID/WPR_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📈 Analytics Endpoints

### 15. Get Teacher Analytics

```bash
curl -X GET http://localhost:5000/api/analytics/teacher \
  -H "Authorization: Bearer TEACHER_TOKEN_HERE"
```

**Response:**
```json
{
  "totalProjects": 5,
  "approvedProjects": 3,
  "pendingProjects": 1,
  "completedProjects": 1,
  "projectStatusData": [
    { "name": "Approved", "value": 3 },
    { "name": "Pending", "value": 1 },
    { "name": "Completed", "value": 1 }
  ],
  "semesterData": [
    { "name": "Sem 1", "value": 0 },
    { "name": "Sem 2", "value": 1 },
    { "name": "Sem 3", "value": 2 },
    { "name": "Sem 4", "value": 2 }
  ],
  "lowProgressProjects": [
    {
      "_id": "63f7a1b2c5d3e4f5g6h7i8j0",
      "title": "Database Design",
      "progress": 20
    }
  ]
}
```

### 16. Get Student Analytics

```bash
curl -X GET http://localhost:5000/api/analytics/student/STUDENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🧪 Testing Workflow

### Complete Flow Test

1. **Register Teacher**
   ```bash
   # Use endpoint #2
   # Save the token and teacher ID
   export TEACHER_TOKEN="token_here"
   export TEACHER_ID="id_here"
   ```

2. **Register Student**
   ```bash
   # Use endpoint #1
   # Save the token and student ID
   export STUDENT_TOKEN="token_here"
   export STUDENT_ID="id_here"
   ```

3. **Student Requests Project**
   ```bash
   curl -X POST http://localhost:5000/api/projects/request \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $STUDENT_TOKEN" \
     -d '{
       "title": "Mobile App",
       "description": "Build React Native mobile app",
       "teamMembers": []
     }'
   # Save PROJECT_ID
   export PROJECT_ID="id_here"
   ```

4. **Teacher Approves Project**
   ```bash
   curl -X POST http://localhost:5000/api/projects/$PROJECT_ID/approve \
     -H "Authorization: Bearer $TEACHER_TOKEN"
   ```

5. **Student Submits WPR Week 1**
   ```bash
   curl -X POST http://localhost:5000/api/wpr/$PROJECT_ID/submit \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $STUDENT_TOKEN" \
     -d '{
       "weekNumber": 1,
       "progressDescription": "Setup development environment and learned React Native"
     }'
   ```

6. **Student Submits WPR Week 2**
   ```bash
   curl -X POST http://localhost:5000/api/wpr/$PROJECT_ID/submit \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $STUDENT_TOKEN" \
     -d '{
       "weekNumber": 2,
       "progressDescription": "Created UI screens and navigation"
     }'
   ```

7. **View Project Details**
   ```bash
   curl -X GET http://localhost:5000/api/projects/$PROJECT_ID \
     -H "Authorization: Bearer $STUDENT_TOKEN"
   # Should show progress: 20 (2 WPRs × 10%)
   ```

8. **View WPRs**
   ```bash
   curl -X GET http://localhost:5000/api/wpr/$PROJECT_ID \
     -H "Authorization: Bearer $STUDENT_TOKEN"
   ```

9. **Teacher Views Analytics**
   ```bash
   curl -X GET http://localhost:5000/api/analytics/teacher \
     -H "Authorization: Bearer $TEACHER_TOKEN"
   ```

10. **Teacher Updates Progress Manually**
    ```bash
    curl -X PATCH http://localhost:5000/api/projects/$PROJECT_ID/progress \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TEACHER_TOKEN" \
      -d '{
        "progress": 50
      }'
    ```

---

## 🛠 Using Postman

1. Create new Postman collection: "Project Management API"

2. Add environment variables:
   ```
   {{base_url}} = http://localhost:5000/api
   {{student_token}} = (will be set after login)
   {{teacher_token}} = (will be set after login)
   {{project_id}} = (will be set after request)
   ```

3. Create requests folder:
   - Auth
   - Projects
   - WPR
   - Analytics

4. Use {{base_url}} and {{token}} in requests

---

## ✅ Error Handling

### 400 Bad Request
```json
{
  "message": "Invalid email or missing fields"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided" 
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized"
}
```

### 404 Not Found
```json
{
  "message": "Project not found"
}
```

### 500 Server Error
```json
{
  "message": "Internal server error"
}
```

---

## 📋 Quick Reference

| Endpoint | Method | Auth | Role |
|----------|--------|------|------|
| /auth/register | POST | ❌ | - |
| /auth/login | POST | ❌ | - |
| /auth/me | GET | ✅ | Any |
| /projects/request | POST | ✅ | Student |
| /projects/student | GET | ✅ | Student |
| /projects/teacher | GET | ✅ | Teacher |
| /projects/:id | GET | ✅ | Any |
| /projects/:id/approve | POST | ✅ | Teacher |
| /projects/:id/reject | POST | ✅ | Teacher |
| /projects/:id/progress | PATCH | ✅ | Teacher |
| /wpr/:id/submit | POST | ✅ | Student |
| /wpr/:id | GET | ✅ | Any |
| /wpr/:id/:id | GET | ✅ | Any |
| /analytics/teacher | GET | ✅ | Teacher |
| /analytics/student/:id | GET | ✅ | Any |

---

Happy Testing! 🚀
