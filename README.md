# TaskFlow AI - React Version (Simple UI)

A clean, minimal task management application with AI-powered chat assistant, voice input/output, and simple UI built with React and Tailwind CSS.

## Features

✨ **AI-Powered Task Management**

- Natural language task creation and management
- Intelligent task organization
- Real-time task updates

🎤 **Voice Capabilities**

- Voice input using Web Speech API
- AI voice output with premium audio playback
- Toggle voice features on/off

🔐 **Authentication**

- Secure login and registration
- JWT token-based authentication
- Protected routes

👨‍💼 **Admin Panel** (New!)

- View system statistics (users, tasks, completion rates)
- Configure AI model settings (GPT model, max tokens)
- Manage voice settings (TTS model, enable/disable)
- Set user limits (max tasks per user)
- Real-time settings updates

💬 **Interactive Chat**

- Real-time AI assistant
- Message history
- Loading states and error handling

🎨 **Clean & Simple UI**

- Minimal, clutter-free design
- Easy-to-read typography
- Light color scheme
- Clear visual hierarchy

## Tech Stack

- **React 18** - UI library
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool
- **Web Speech API** - Voice recognition
- **Audio API** - Premium voice playback

## Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:8080` (not included)

## Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

3. **Build for production**

   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## Configuration

### API Endpoint

Update the `API_URL` constant in `App.jsx` to point to your backend:

```javascript
const API_URL = "http://localhost:8080/api";
```

### Backend Requirements

The app expects the following API endpoints:

**Authentication:**

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

**Tasks:**

- `GET /api/tasks` - Get all tasks (requires auth)

**AI Agent:**

- `POST /api/agent/query` - Send message to AI
- `POST /api/agent/query?voice=true` - Get AI response with audio

**Admin (requires admin privileges):**

- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/settings` - Get app settings
- `PUT /api/admin/settings` - Update app settings

**Expected Response Format:**

```json
{
  "response": "AI response text",
  "tasks": [...],
  "audio": "base64-encoded-audio-data" // optional, when voice=true
}
```

## Features Guide

### Voice Input

1. Click the microphone button in the chat input
2. Speak your message
3. The transcribed text will appear in the input field

### Voice Output

1. Click the speaker icon in the top navigation to enable/disable
2. When enabled, AI responses will be spoken aloud
3. Click the stop button to interrupt playback

### Task Management

- Create tasks using natural language in chat
- Filter tasks by status (All/Active)
- View task priorities and due dates
- Real-time task updates

### Admin Panel Access

1. Login with an admin account
2. Click the purple shield icon in the top navigation
3. Access statistics and settings tabs
4. Modify system settings as needed
5. Click "Save Settings" to apply changes

**Admin Features:**

- **Statistics Dashboard:** View total users, tasks, completion rates
- **AI Settings:** Configure GPT model and max tokens
- **Voice Settings:** Enable/disable TTS and speech recognition
- **User Limits:** Set maximum tasks per user

**Note:** To make a user an admin, update the database:

```sql
UPDATE users SET is_admin = true WHERE email = 'admin@example.com';
```

### Authentication

- Sign up with name, email, and password
- Sign in with email and password
- Session persists in localStorage
- Auto-logout on token expiration

### Authentication Flow

- Login/Register screen with animated background
- Form validation
- Error handling
- Token storage

### Chat Interface

- Message history with timestamps
- User/AI message differentiation
- Loading indicators
- Error messages
- Example prompts for new users

### Task Sidebar

- Task filtering (All/Active)
- Visual task status (completed/pending)
- Priority badges
- Due date display
- Empty state

### Admin Panel

- Statistics dashboard with key metrics
- Settings management (AI, Voice, Limits)
- Toggle switches for features
- Real-time updates
- Admin authentication check

### Voice Features

- Speech recognition initialization
- Audio playback from base64
- Speaking indicators
- Voice toggle controls

## Customization

### Colors

Modify gradient colors in `App.jsx`:

```javascript
// Current: purple-blue gradient
bg-gradient-to-r from-purple-600 to-blue-600

// Change to: pink-orange gradient
bg-gradient-to-r from-pink-600 to-orange-600
```

### Fonts

Update in `index.css`:

```css
body {
  font-family: "Your Font", sans-serif;
}
```

### Animation Speed

Adjust transition durations:

```javascript
className = "transition-all duration-300";
```

## Browser Support

- Chrome/Edge (recommended for voice features)
- Firefox (limited voice support)
- Safari (limited voice support)

**Note:** Web Speech API support varies by browser. For best experience, use Chrome or Edge.

## Troubleshooting

### Voice Input Not Working

- Ensure microphone permissions are granted
- Check browser compatibility (Chrome/Edge recommended)
- Verify HTTPS connection (required for speech API)

### API Connection Issues

- Verify backend is running on correct port
- Check CORS configuration on backend
- Ensure API_URL is correct

### Build Errors

- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

## Performance Tips

- Tasks list is virtualized for large datasets
- Messages auto-scroll to bottom
- Optimized re-renders with React hooks
- Lazy loading for images (if added)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## Support

For issues and questions, please open an issue on GitHub.
