# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- npm installed

## First Time Setup

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

## Running the Application

You need to run both backend and frontend in separate terminals.

### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```

Wait for the message:
```
🚀 Queue Management System Backend
📡 Server running on: http://localhost:3000
🔌 WebSocket available on: ws://localhost:3000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Wait for:
```
VITE ready in XXX ms
➜ Local: http://localhost:5173/
```

## Access the Application

Open your browser and navigate to:

1. **Customer Kiosk** (Get Tickets): http://localhost:5173/kiosk
2. **Staff Login**: http://localhost:5173/login
3. **Display Screen** (For TV): http://localhost:5173/display

### Default Login Credentials
- Username: `admin`
- Password: `admin123`

## Using the System

### For Customers
1. Go to `/kiosk`
2. Click on a service category (A, B, or C)
3. Your queue number appears
4. Click "Print Ticket" to print
5. Wait for your number to be called

### For Staff
1. Login at `/login` with admin/admin123
2. View waiting queues
3. Click "Call" to call next customer
4. Click "Complete" when service is done
5. Use "Skip" for no-shows

### For Display Screen
1. Open `/display` on a TV/monitor
2. Press F11 for full-screen
3. Shows current and next queue numbers
4. Announces queue numbers automatically (text-to-speech)

### For Admins
1. Login and go to `/admin`
2. Add/edit/delete categories
3. Change announcement language (Indonesian/English)
4. Customize announcement templates
5. Reset queues if needed

## Troubleshooting

### Backend won't start
- Make sure port 3000 is not in use
- Delete `database.sqlite` and restart

### Frontend won't start
- Make sure port 5173 is not in use
- Clear node_modules and run `npm install` again

### WebSocket not connecting
- Make sure backend is running first
- Check backend terminal for any errors

### Speech not working
- Use Chrome or Edge browser
- Allow microphone permissions if asked
- Some browsers require HTTPS for speech API

## Production Build

### Build Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Build Frontend
```bash
cd frontend
npm run build
# Files will be in dist/ folder
```

Serve the frontend dist/ folder with any web server (NGINX, Apache, etc.)

## Next Steps

- Change default admin password in `/admin`
- Add more categories if needed
- Customize announcement templates
- Configure display settings

## Need Help?

See [README.md](./README.md) for detailed documentation
See [AGENTS.md](./AGENTS.md) for development guidelines
