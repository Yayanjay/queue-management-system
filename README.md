# Queue Management System

A modern, full-stack queue management system with real-time updates and text-to-speech announcements.

## Features

- **Customer Kiosk**: Self-service queue ticket generation with printing
- **Staff Dashboard**: Call, serve, and manage queue numbers
- **Display Screen**: Full-screen TV display with real-time updates and voice announcements
- **Re-announce Feature**: Staff can re-announce current queue from dashboard
- **Admin Panel**: Manage categories, users, and system settings
- **Multi-language Support**: Indonesian and English announcements
- **Real-time Updates**: WebSocket-based live queue updates
- **Printable Tickets**: Browser-based ticket printing

## Tech Stack

### Backend
- NestJS
- TypeORM
- SQLite (production: PostgreSQL recommended)
- Socket.io for WebSockets
- JWT Authentication

### Frontend
- Vue.js 3 (Composition API)
- TypeScript
- Tailwind CSS
- Pinia (State Management)
- Axios
- Socket.io Client
- Web Speech API

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with Web Speech API support

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "Queue System App"
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start the backend** (in terminal 1)
```bash
cd backend
npm run start:dev
```
Backend will run on `http://localhost:3000`

2. **Start the frontend** (in terminal 2)
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

3. **Access the application**
- Customer Kiosk: `http://localhost:5173/kiosk`
- Staff Login: `http://localhost:5173/login`
- Display Screen: `http://localhost:5173/display`

### Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

**Important**: Change these credentials in production!

## Application Routes

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/kiosk` | Customer kiosk for getting tickets | No |
| `/login` | Staff/admin login | No |
| `/staff` | Staff dashboard for managing queues | Yes |
| `/display` | Full-screen display for TV/monitor | No |
| `/admin` | Admin settings and configuration | Yes (Admin only) |

## Usage Guide

### For Customers

1. Go to the kiosk screen (`/kiosk`)
2. Select your service category
3. Your queue number will be displayed
4. Click "Print Ticket" to print
5. Wait for your number to be called

### For Staff

1. Login at `/login`
2. View waiting queues on the dashboard
3. Click "Call" to call the next customer
4. Click "Complete" when service is finished
5. Use "Skip" for no-shows

### For Display Screen

1. Open `/display` on a TV/monitor
2. Press F11 for full-screen mode
3. Current queue and next queues will be displayed
4. Announcements will play automatically when queues are called

### For Admins

1. Login and navigate to `/admin`
2. Manage queue categories (add/edit/disable/delete)
3. Configure announcement language and templates
4. Adjust display settings
5. Reset queues when needed

## Configuration

### Default Categories

- **Umum (A)**: General Service
- **Prioritas (B)**: Priority Service
- **Khusus (C)**: Special Service

### Announcement Templates

- **Indonesian**: "Nomor antrian {number}, silakan menuju loket"
- **English**: "Queue number {number}, please proceed to the counter"

Use `{number}` as a placeholder for the queue number.

### Environment Variables

Create `backend/.env`:
```
JWT_SECRET=your-secret-key-change-in-production
PORT=3000
```

## Database

The system uses SQLite by default, storing data in `backend/database.sqlite`.

For production, it's recommended to use PostgreSQL. Update the TypeORM configuration in `backend/src/app.module.ts`.

## Development

### Project Structure

```
.
├── backend/                # NestJS backend
│   ├── src/
│   │   ├── auth/          # Authentication
│   │   ├── user/          # User management
│   │   ├── category/      # Queue categories
│   │   ├── queue/         # Queue management
│   │   └── settings/      # App settings
│   └── database.sqlite    # SQLite database
│
└── frontend/              # Vue.js frontend
    ├── src/
    │   ├── views/         # Page components
    │   ├── stores/        # Pinia stores
    │   ├── composables/   # Reusable composition functions
    │   └── services/      # API services
    └── index.html
```

### API Endpoints

#### Authentication
- `POST /auth/login` - Login
- `POST /auth/register` - Register (admin only)
- `GET /auth/profile` - Get user profile

#### Categories
- `GET /categories` - List active categories
- `POST /categories` - Create category (admin)
- `PATCH /categories/:id` - Update category (admin)
- `DELETE /categories/:id` - Delete category (admin)

#### Queues
- `POST /queues` - Create new queue ticket
- `GET /queues` - List queues
- `GET /queues/current` - Get current and next queues
- `POST /queues/:id/call` - Call queue
- `POST /queues/:id/complete` - Complete queue
- `POST /queues/:id/skip` - Skip queue

#### Settings
- `GET /settings` - Get all settings
- `PATCH /settings` - Update settings (admin)

### WebSocket Events

- `queue:created` - New ticket created
- `queue:called` - Queue number called
- `queue:completed` - Queue completed
- `queue:updated` - Queue status changed
- `queue:reannounce` - Queue re-announcement triggered

## Production Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Build the backend:
```bash
cd backend
npm run build
```

3. Set environment variables (especially `JWT_SECRET`)

4. Run the backend:
```bash
cd backend
npm run start:prod
```

5. Serve frontend build files with a web server (NGINX, Apache, etc.)

6. Configure reverse proxy to backend API

## Browser Compatibility

- Chrome 33+ (recommended)
- Firefox 49+
- Safari 7+
- Edge 14+

For best text-to-speech support, use Chrome or Edge.

## Troubleshooting

### WebSocket connection fails
- Check if backend is running
- Verify CORS settings in `backend/src/main.ts`
- Update WebSocket URL in `frontend/src/composables/useWebSocket.ts`

### Text-to-speech not working
- Ensure browser supports Web Speech API
- Check browser permissions
- Try using Chrome or Edge
- Some browsers require HTTPS for speech API

### Database errors
- Delete `backend/database.sqlite` and restart backend
- This will reset all data including default admin user

### Print not working
- Browser print dialog requires user interaction
- Some browsers block print() on page load
- Try allowing popups for the site

## Contributing

For development guidelines, see [AGENTS.md](./AGENTS.md).

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
