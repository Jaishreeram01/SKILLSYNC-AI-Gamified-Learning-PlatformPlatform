# SkillSync Frontend Architecture

## Project Structure

\`\`\`
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── SignupForm.jsx
│   │   ├── AuthGuard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── MainLayout.jsx
│   ├── dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── QuickStats.jsx
│   │   ├── RecentActivity.jsx
│   │   └── UpcomingTasks.jsx
│   ├── skills/
│   │   ├── SkillBrowser.jsx
│   │   ├── SkillCard.jsx
│   │   ├── AddSkillModal.jsx
│   │   └── SkillEndorsement.jsx
│   ├── teams/
│   │   ├── TeamList.jsx
│   │   ├── TeamCard.jsx
│   │   ├── CreateTeamForm.jsx
│   │   ├── TeamDetail.jsx
│   │   ├── MemberList.jsx
│   │   └── InviteMemberModal.jsx
│   ├── matching/
│   │   ├── MatchingEngine.jsx
│   │   ├── MatchSuggestions.jsx
│   │   ├── MatchCard.jsx
│   │   └── CompatibilityScore.jsx
│   ├── projects/
│   │   ├── ProjectList.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── ProjectDetail.jsx
│   │   ├── KanbanBoard.jsx
│   │   └── TaskCard.jsx
│   ├── chat/
│   │   ├── ChatWindow.jsx
│   │   ├── MessageList.jsx
│   │   ├── MessageInput.jsx
│   │   └── TeamChat.jsx
│   ├── leaderboard/
│   │   ├── Leaderboard.jsx
│   │   ├── LeaderboardRow.jsx
│   │   └── BadgeDisplay.jsx
│   ├── profile/
│   │   ├── UserProfile.jsx
│   │   ├── ProfileEdit.jsx
│   │   └── SkillsSection.jsx
│   └── common/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Modal.jsx
│       └── LoadingSpinner.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useTeams.js
│   ├── useMatching.js
│   ├── useProjects.js
│   ├── useChat.js
│   └── useFetch.js
├── services/
│   ├── api.js
│   ├── firebase.js
│   ├── auth.js
│   ├── teams.js
│   ├── matching.js
│   ├── projects.js
│   ├── chat.js
│   └── storage.js
├── context/
│   ├── AuthContext.jsx
│   ├── UserContext.jsx
│   ├── TeamsContext.jsx
│   └── NotificationContext.jsx
├── utils/
│   ├── helpers.js
│   ├── validators.js
│   ├── constants.js
│   └── formatters.js
├── styles/
│   ├── global.css
│   ├── variables.css
│   └── tailwind.config.js
└── App.jsx

public/
├── assets/
│   ├── images/
│   ├── icons/
│   └── logos/
└── index.html
\`\`\`

## Key Components

### 1. Authentication Components
- **LoginForm**: Email/password login with validation
- **SignupForm**: New user registration
- **AuthGuard**: Middleware component checking authentication
- **ProtectedRoute**: Route guard for authenticated pages

### 2. Dashboard Components
- **Dashboard**: Main landing page after login
- **QuickStats**: Shows user points, teams, projects
- **RecentActivity**: Feed of recent user activities
- **UpcomingTasks**: Widget showing tasks due soon

### 3. Skills Management
- **SkillBrowser**: Searchable, filterable list of all skills
- **SkillCard**: Display individual skill with endorsement button
- **AddSkillModal**: Form to add skills to user profile
- **SkillEndorsement**: Manage endorsements received

### 4. Team Management
- **TeamList**: Browse and search teams
- **TeamCard**: Quick preview card for teams
- **CreateTeamForm**: Form to create new team
- **TeamDetail**: Full team page with members, projects, chat
- **MemberList**: Display team members with roles
- **InviteMemberModal**: Invite users to team

### 5. AI Matching Engine (Core Feature)
- **MatchingEngine**: Orchestrates matching logic
- **MatchSuggestions**: Display AI-generated suggestions
- **MatchCard**: Individual match card with score and reasoning
- **CompatibilityScore**: Visual representation of compatibility (e.g., progress bar)

### 6. Projects
- **ProjectList**: Browse team projects
- **ProjectCard**: Quick project overview
- **ProjectDetail**: Full project page
- **KanbanBoard**: Drag-and-drop task board (using React DnD)
- **TaskCard**: Individual task with assignee and due date

### 7. Real-time Chat
- **ChatWindow**: Main chat interface
- **MessageList**: Scrollable message history
- **MessageInput**: Input field with emoji and file support
- **TeamChat**: Team-specific chat integration

### 8. Gamification
- **Leaderboard**: Ranked user list with points
- **LeaderboardRow**: Individual leaderboard entry
- **BadgeDisplay**: Show earned badges

### 9. User Profile
- **UserProfile**: Public user profile view
- **ProfileEdit**: Edit user information
- **SkillsSection**: Manage user skills

## State Management Strategy

### Redux Store Structure
\`\`\`
store/
├── auth/
│   ├── authSlice.js
│   └── authActions.js
├── user/
│   ├── userSlice.js
│   └── userActions.js
├── teams/
│   ├── teamsSlice.js
│   └── teamsActions.js
├── projects/
│   ├── projectsSlice.js
│   └── projectsActions.js
├── matching/
│   ├── matchingSlice.js
│   └── matchingActions.js
└── ui/
    ├── uiSlice.js (modals, notifications, loading states)
    └── uiActions.js
\`\`\`

### Redux State Shape
\`\`\`javascript
{
  auth: {
    isAuthenticated: boolean,
    user: { uid, email, fullName, role },
    token: string,
    loading: boolean,
    error: null | string
  },
  user: {
    profile: { fullName, bio, avatar, skills, interests },
    mySkills: [{ skillId, name, level, endorsements }],
    points: number,
    badges: [badgeIds],
    loading: boolean
  },
  teams: {
    allTeams: [teamObjects],
    myTeams: [teamObjects],
    selectedTeam: teamObject | null,
    loading: boolean,
    error: null | string
  },
  projects: {
    projects: [projectObjects],
    selectedProject: projectObject | null,
    tasks: [taskObjects],
    loading: boolean
  },
  matching: {
    suggestions: [{ userId, score, matchReason, ... }],
    generatedAt: timestamp,
    loading: boolean
  },
  ui: {
    modals: { createTeam: false, addSkill: false, ... },
    notifications: [{ id, type, message, ... }],
    globalLoading: boolean
  }
}
\`\`\`

## Hooks Implementation

### useAuth
\`\`\`javascript
const { user, isAuthenticated, login, signup, logout, loading } = useAuth();
\`\`\`

### useMatching
\`\`\`javascript
const { suggestions, generate, refresh, loading } = useMatching(userId);
\`\`\`

### useTeams
\`\`\`javascript
const { teams, selectedTeam, create, join, leave, update } = useTeams();
\`\`\`

### useChat
\`\`\`javascript
const { messages, send, onMessage, loading } = useChat(teamId);
\`\`\`

## Styling Strategy

- **TailwindCSS**: Utility-first CSS framework
- **CSS Variables**: Brand colors and spacing
- **Responsive Design**: Mobile-first approach
- **Component-scoped Styles**: CSS modules for complex components

### Color Scheme
- Primary: #2563EB (Blue) - CTAs, active states
- Secondary: #7C3AED (Purple) - Accents
- Success: #10B981 (Green)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Red)
- Neutral: #6B7280 (Gray)
- Background: #FFFFFF / #F9FAFB
- Text: #1F2937 / #111827

## Performance Optimization

1. **Code Splitting**: Lazy load route components
2. **Memoization**: useMemo for expensive computations
3. **Virtualization**: Long lists use react-window
4. **Caching**: Cache API responses with React Query
5. **Debouncing**: Search inputs debounced (300ms)
6. **Image Optimization**: Use WebP with fallbacks

## Accessibility Standards

- WCAG 2.1 AA compliance
- Semantic HTML elements
- ARIA labels for screen readers
- Keyboard navigation support
- Color contrast ratios >= 4.5:1
- Focus indicators on interactive elements
\`\`\`
