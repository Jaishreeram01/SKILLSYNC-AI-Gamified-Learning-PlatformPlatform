# SkillSync Architecture Documentation

## System Overview

SkillSync is an AI-powered collaborative learning platform that connects learners based on complementary skills. The system uses intelligent matching algorithms to form effective teams and facilitate skill-based collaboration.

### High-Level Architecture

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│          React.js + Redux/Context API + TailwindCSS      │
└────────────────────┬────────────────────────────────────┘
                     │ REST API + WebSocket
┌────────────────────▼────────────────────────────────────┐
│                  Application Layer                       │
│    Express.js + Node.js (Middleware, Controllers)        │
├─────────────────────────────────────────────────────────┤
│  Routes | Auth | Skill Matching | Chat | Projects | etc. │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Service Layer                          │
│  AI Service | User Service | Project Service | etc.     │
├─────────────────────────────────────────────────────────┤
│  Business Logic | Gemini API Integration | Validation   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                Data Access Layer                        │
│    Firebase (Firestore, Auth, Real-time DB)            │
├─────────────────────────────────────────────────────────┤
│  Users | Skills | Teams | Projects | Messages | etc.    │
└─────────────────────────────────────────────────────────┘
\`\`\`

## Database Schema

### Collections in Firestore

#### 1. **users**
- **uid** (string, PK): Firebase Auth UID
- **email** (string, unique): User email
- **fullName** (string): Full name
- **role** (enum): "student" | "mentor" | "team_lead"
- **bio** (string): User bio
- **avatar** (string): Avatar URL
- **skills** (array): [{ skillId, level: "beginner"/"intermediate"/"expert", endorsements: 0 }]
- **interests** (array): Learning interests
- **joinedAt** (timestamp): Account creation date
- **availability** (enum): "available" | "busy" | "offline"
- **preferences** (object): Notification, privacy settings
- **points** (number): Leaderboard points
- **badges** (array): Badge IDs earned
- **createdAt** (timestamp)
- **updatedAt** (timestamp)

#### 2. **skills**
- **skillId** (string, PK): Unique skill identifier
- **name** (string): Skill name (e.g., "React", "Python")
- **category** (string): "frontend" | "backend" | "mobile" | "devops" | "design" | "data" | "other"
- **description** (string): Brief description
- **difficulty** (enum): "beginner" | "intermediate" | "expert"
- **endorsements** (number): Total endorsements count
- **createdAt** (timestamp)

#### 3. **userSkillEndorsements**
- **endorsementId** (string, PK)
- **skillId** (string, FK): Skill being endorsed
- **userId** (string, FK): User being endorsed
- **endorsedBy** (string, FK): Endorser's UID
- **createdAt** (timestamp)

#### 4. **teams**
- **teamId** (string, PK): Unique team identifier
- **name** (string): Team name
- **description** (string): Team description
- **leader** (string, FK): Team lead UID
- **members** (array): [{ userId, role: "leader"/"developer"/"designer"/"manager", joinedAt }]
- **requiredSkills** (array): [{ skillId, level, priority }]
- **complementaryMatch** (object): { leader: score, matchDetails: {...} }
- **project** (string, FK): Linked project ID (if any)
- **status** (enum): "forming" | "active" | "completed" | "archived"
- **createdAt** (timestamp)
- **updatedAt** (timestamp)

#### 5. **projects**
- **projectId** (string, PK): Unique project identifier
- **title** (string): Project title
- **description** (string): Detailed description
- **team** (string, FK): Associated team ID
- **status** (enum): "planning" | "in_progress" | "completed" | "archived"
- **startDate** (timestamp)
- **endDate** (timestamp)
- **tasks** (array): [{ taskId, title, description, assignee, status, dueDate }]
- **resources** (array): [{ type: "file"/"link", url, uploadedBy, uploadedAt }]
- **createdAt** (timestamp)
- **updatedAt** (timestamp)

#### 6. **messages**
- **messageId** (string, PK)
- **teamId** (string, FK): Team the message belongs to
- **sender** (string, FK): Sender UID
- **content** (string): Message content
- **attachments** (array): File references
- **reactions** (object): { emoji: [userIds] }
- **createdAt** (timestamp)
- **updatedAt** (timestamp)

#### 7. **skillMatches**
- **matchId** (string, PK)
- **userId** (string, FK): User ID
- **suggestedMatches** (array): [{ matchedUserId, compatibilityScore: 0-100, matchReason, commonSkills, complementarySkills }]
- **generatedAt** (timestamp)
- **expiresAt** (timestamp): Cache expiry (24 hours)

#### 8. **leaderboard**
- **leaderboardId** (string, PK)
- **userId** (string, FK)
- **points** (number): Total points
- **rank** (number): Current rank
- **completedProjects** (number)
- **teamsLed** (number)
- **skillEndorsements** (number)
- **contributionScore** (number)
- **updatedAt** (timestamp)

#### 9. **badges**
- **badgeId** (string, PK)
- **name** (string): Badge name
- **description** (string): Badge description
- **icon** (string): Icon URL
- **criteria** (object): Achievement criteria
- **createdAt** (timestamp)

#### 10. **userBadges**
- **userBadgeId** (string, PK)
- **userId** (string, FK)
- **badgeId** (string, FK)
- **earnedAt** (timestamp)

### Index Strategy

**Composite Indexes (for complex queries):**
- users: email (descending)
- teams: leader + status
- projects: team + status
- messages: teamId + createdAt (descending)
- leaderboard: points (descending)

## API Response Standards

### Success Response
\`\`\`json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
\`\`\`

### Error Response
\`\`\`json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* optional detailed info */ }
  }
}
\`\`\`

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Authentication Flow

1. User signs up with email/password via Firebase Auth
2. Firebase returns JWT token + UID
3. Token stored in secure HTTP-only cookie + localStorage fallback
4. Every request includes Authorization header: `Bearer {token}`
5. Backend validates token via Firebase Admin SDK
6. Refresh token rotated every 24 hours

## Real-time Communication

**Socket.io Events:**
- `user:online` / `user:offline`: User availability
- `team:message`: Team chat messages
- `task:updated`: Project task changes
- `team:member:joined` / `team:member:left`: Team membership changes
- `notification:new`: Real-time notifications

## Caching Strategy

- **User profiles**: 5 min cache, invalidate on update
- **Skill matches**: 24 hour cache, regenerate daily
- **Leaderboard**: 1 hour cache, update on score changes
- **Public skill list**: 7 day cache
- **Team data**: 10 min cache, real-time updates via WebSocket
