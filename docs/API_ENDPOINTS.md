# SkillSync API Endpoints Reference

## Base URL
\`\`\`
Development: http://localhost:5000/api
Production: https://skillsync-api.render.com/api
\`\`\`

## Authentication Endpoints

### POST /auth/signup
Register a new user
\`\`\`
Request:
{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"
}

Response:
{
  "success": true,
  "data": {
    "uid": "firebase-uid",
    "token": "jwt-token",
    "user": { email, fullName, role: "student" }
  }
}
\`\`\`

### POST /auth/login
Login existing user
\`\`\`
Request:
{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: Same as signup
\`\`\`

### POST /auth/logout
Logout user (invalidate token)

### POST /auth/refresh
Refresh JWT token
\`\`\`
Response:
{
  "success": true,
  "data": { "token": "new-jwt-token" }
}
\`\`\`

---

## User Endpoints

### GET /users/me
Get current authenticated user profile

### GET /users/:userId
Get specific user profile by ID

### PUT /users/me
Update user profile
\`\`\`
Request:
{
  "fullName": "Jane Doe",
  "bio": "Learning React and Node.js",
  "interests": ["web development", "AI"],
  "avatar": "url-to-avatar"
}
\`\`\`

### GET /users/:userId/skills
Get user's skills
\`\`\`
Response:
{
  "success": true,
  "data": [
    { "skillId": "react", "name": "React", "level": "expert", "endorsements": 5 },
    { "skillId": "node", "name": "Node.js", "level": "intermediate", "endorsements": 3 }
  ]
}
\`\`\`

### POST /users/me/skills
Add skill to user profile
\`\`\`
Request:
{
  "skillId": "react",
  "level": "intermediate"
}
\`\`\`

### DELETE /users/me/skills/:skillId
Remove skill from profile

### POST /users/:userId/skills/:skillId/endorse
Endorse another user's skill

### GET /users/leaderboard
Get leaderboard rankings
\`\`\`
Query params:
- page: number (default: 1)
- limit: number (default: 50)
- sortBy: "points" | "completedProjects" | "teamsLed" (default: "points")

Response:
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "user": { uid, fullName, avatar },
      "points": 1500,
      "completedProjects": 5,
      "teamsLed": 2
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 150 }
}
\`\`\`

---

## Skills Endpoints

### GET /skills
Get all available skills
\`\`\`
Query params:
- category: string (optional)
- difficulty: string (optional)
- search: string (optional)

Response:
{
  "success": true,
  "data": [
    { "skillId": "react", "name": "React", "category": "frontend", "difficulty": "intermediate" }
  ]
}
\`\`\`

### GET /skills/:skillId
Get specific skill details

### POST /skills
Create new skill (admin only)
\`\`\`
Request:
{
  "name": "React",
  "category": "frontend",
  "description": "JavaScript library for building UIs",
  "difficulty": "intermediate"
}
\`\`\`

---

## Team Endpoints

### GET /teams
Get all teams (with filters)
\`\`\`
Query params:
- status: "forming" | "active" | "completed"
- search: string
- page, limit

Response includes team details, members, match score
\`\`\`

### GET /teams/:teamId
Get specific team details

### POST /teams
Create new team
\`\`\`
Request:
{
  "name": "AI Developers",
  "description": "Team focused on AI/ML projects",
  "requiredSkills": [
    { "skillId": "python", "level": "intermediate", "priority": 1 },
    { "skillId": "tensorflow", "level": "beginner", "priority": 2 }
  ]
}

Response includes: teamId, complementary match score
\`\`\`

### PUT /teams/:teamId
Update team details (leader only)

### DELETE /teams/:teamId
Delete team (leader only)

### POST /teams/:teamId/members
Join or invite member to team
\`\`\`
Request:
{
  "userId": "uid-to-add",
  "role": "developer"
}
\`\`\`

### DELETE /teams/:teamId/members/:userId
Remove member from team (leader only)

### PUT /teams/:teamId/members/:userId/role
Update member role in team

---

## AI Skill Matching Endpoints

### POST /ai/match-users
Get skill-based user matches (core feature)
\`\`\`
Request:
{
  "userId": "current-user-uid",
  "type": "teams" | "teammates",
  "limit": 5
}

Response:
{
  "success": true,
  "data": {
    "matches": [
      {
        "userId": "matched-user-uid",
        "name": "Jane Doe",
        "compatibilityScore": 92,
        "matchReason": "Complementary backend skills",
        "commonSkills": ["Node.js", "MongoDB"],
        "complementarySkills": ["React", "TypeScript"],
        "userSkills": [{ skillId, name, level, endorsements }]
      }
    ],
    "generatedAt": "2024-01-15T10:30:00Z"
  }
}
\`\`\`

### POST /teams/suggest-members
Suggest members for a team based on required skills
\`\`\`
Request:
{
  "teamId": "team-id",
  "limit": 10
}

Response: Array of suggested members with scores
\`\`\`

### GET /ai/match-cache/refresh
Manually refresh match cache for current user

---

## Project Endpoints

### GET /projects
Get all projects (with filters)
\`\`\`
Query params:
- teamId, status, page, limit
\`\`\`

### GET /projects/:projectId
Get specific project details

### POST /projects
Create new project (team member)
\`\`\`
Request:
{
  "title": "E-commerce Platform",
  "description": "Build a full-stack e-commerce app",
  "teamId": "team-id",
  "startDate": "2024-01-20",
  "endDate": "2024-03-20"
}
\`\`\`

### PUT /projects/:projectId
Update project details

### DELETE /projects/:projectId
Delete project (creator or team lead only)

### POST /projects/:projectId/tasks
Create project task
\`\`\`
Request:
{
  "title": "Setup authentication",
  "description": "Implement JWT auth",
  "assignee": "user-uid",
  "dueDate": "2024-02-01"
}
\`\`\`

### PUT /projects/:projectId/tasks/:taskId
Update task (status, assignee, etc.)

### DELETE /projects/:projectId/tasks/:taskId
Delete task

---

## Chat/Messaging Endpoints

### GET /teams/:teamId/messages
Get team chat messages
\`\`\`
Query params:
- limit: 50 (default)
- before: timestamp (for pagination)
\`\`\`

### POST /teams/:teamId/messages
Send message to team
\`\`\`
Request:
{
  "content": "Message text",
  "attachments": [{ "url": "file-url", "name": "filename" }]
}
\`\`\`

### PUT /messages/:messageId
Edit message (sender only)

### DELETE /messages/:messageId
Delete message (sender or team lead only)

### POST /messages/:messageId/reactions
Add emoji reaction to message
\`\`\`
Request:
{
  "emoji": "👍"
}
\`\`\`

### DELETE /messages/:messageId/reactions/:emoji
Remove emoji reaction

---

## Gamification Endpoints

### GET /badges
Get all available badges

### GET /users/:userId/badges
Get user's earned badges

### GET /leaderboard/badges
Get badge leaderboard

---

## File Upload Endpoints

### POST /upload
Upload file to cloud storage
\`\`\`
Request: multipart/form-data
- file: File object
- type: "avatar" | "project-resource" | "team-file"

Response:
{
  "success": true,
  "data": { "url": "cloudinary-url" }
}
\`\`\`

---

## Error Handling

All endpoints follow consistent error response format:

\`\`\`json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Email is required",
    "statusCode": 400
  }
}
\`\`\`

Common error codes:
- `INVALID_REQUEST`: Missing or invalid request data
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: User lacks required permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource already exists
- `INTERNAL_ERROR`: Server error
