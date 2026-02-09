# AGENTS.md - Queue Management System

Developer guide for AI coding agents working in this repository.

## Project Overview

A full-stack queue management system with:
- **Backend**: NestJS + TypeORM + SQLite
- **Frontend**: Vue.js 3 + Tailwind CSS + Pinia
- **Features**: Multi-category queues, real-time WebSocket updates, text-to-speech announcements, printable tickets

---

## Build, Test, and Run Commands

### Backend (NestJS)
```bash
cd backend

# Install dependencies
npm install

# Development (with hot reload)
npm run start:dev

# Production build
npm run build
npm run start:prod

# Run tests
npm run test
npm run test:watch
npm run test:cov

# Lint
npm run lint
```

Backend runs on: `http://localhost:3000`
WebSocket on: `ws://localhost:3000`

### Frontend (Vue.js)
```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
npm run preview

# Type checking
npm run type-check
```

Frontend runs on: `http://localhost:5173`

### Running Single Tests
```bash
# Backend - run specific test file
cd backend
npm run test -- auth.service.spec.ts

# Frontend - type check single file
cd frontend
npx vue-tsc --noEmit src/views/LoginView.vue
```

---

## Code Style Guidelines

### General Principles
- Use TypeScript for all new code
- Follow functional and declarative patterns
- Prioritize readability over cleverness
- Write self-documenting code with clear variable names

### Imports

**Order**: External packages → Internal modules → Types → Styles
```typescript
// External
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

// Internal
import { UserService } from './user.service';
import { QueueGateway } from '../queue/queue.gateway';

// Types
import type { User } from './user.entity';

// Styles (Vue only)
import './styles.css';
```

**Naming**:
- Named imports preferred over default: `import { Component } from 'lib'`
- Alias for conflicts: `import { Queue as QueueEntity } from './entity'`

### Formatting

**Indentation**: 2 spaces (no tabs)
**Line length**: 100 characters max
**Quotes**: Single quotes for strings
**Semicolons**: Required
**Trailing commas**: Yes for multi-line

```typescript
// Good
const config = {
  name: 'Queue System',
  port: 3000,
  features: ['websocket', 'tts'],
};

// Bad
const config = {
  name: "Queue System",
  port: 3000,
  features: ['websocket', 'tts']
}
```

### TypeScript Types

**Always use types**:
```typescript
// Good
function createQueue(categoryId: number): Promise<Queue> {
  // ...
}

// Bad
function createQueue(categoryId) {
  // ...
}
```

**Interfaces for objects, types for unions**:
```typescript
// Interface for objects
interface User {
  id: number;
  name: string;
}

// Type for unions/primitives
type UserRole = 'admin' | 'staff';
type Nullable<T> = T | null;
```

**Avoid `any`**: Use `unknown` and type guards instead

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Variables/Functions | camelCase | `const queueNumber`, `function createQueue()` |
| Classes/Interfaces | PascalCase | `class QueueService`, `interface AppSettings` |
| Components (Vue) | PascalCase | `LoginView.vue`, `QueueCard.vue` |
| Constants | UPPER_SNAKE_CASE | `const MAX_QUEUE_SIZE = 100` |
| Private fields | _prefix | `private _connection: Socket` |
| Boolean variables | is/has prefix | `isActive`, `hasPermission` |
| Event handlers | handle prefix | `handleSubmit()`, `handleClick()` |

### Error Handling

**Backend (NestJS)**:
```typescript
// Use built-in HTTP exceptions
import { NotFoundException, BadRequestException } from '@nestjs/common';

async function findQueue(id: number): Promise<Queue> {
  const queue = await this.queueRepository.findOne({ where: { id } });
  if (!queue) {
    throw new NotFoundException(`Queue with ID ${id} not found`);
  }
  return queue;
}
```

**Frontend (Vue)**:
```typescript
// Use try-catch with user-friendly messages
async function handleLogin() {
  try {
    await authStore.login(username.value, password.value);
    router.push('/staff');
  } catch (error) {
    console.error('Login failed:', error);
    errorMessage.value = 'Invalid username or password';
  }
}

// Use try-catch-finally for cleanup
async function handleReannounce(queueId: number) {
  if (reannouncing.value) return;
  
  reannouncing.value = true;
  try {
    const result = await queueStore.reannounceQueue(queueId);
    console.log('Reannounce success:', result);
  } catch (error) {
    console.error('Reannounce failed:', error);
  } finally {
    // Always re-enable after cooldown, even if API fails
    setTimeout(() => {
      reannouncing.value = false;
    }, 3000);
  }
}
```

### Vue.js Specifics

**Use Composition API**:
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const count = ref(0);
const doubled = computed(() => count.value * 2);

onMounted(() => {
  console.log('Component mounted');
});
</script>
```

**Component structure order**:
1. Template
2. Script setup
3. Styles

**Props & Emits**:
```typescript
interface Props {
  queueId: number;
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
});

const emit = defineEmits<{
  (e: 'update', value: string): void;
}>();
```

### NestJS Specifics

**Module structure**:
```
module/
├── module.module.ts
├── module.controller.ts
├── module.service.ts
├── module.entity.ts
└── dto/
    ├── create-module.dto.ts
    └── update-module.dto.ts
```

**Dependency Injection**:
```typescript
@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
    private categoryService: CategoryService,
  ) {}
}
```

**Guards and Decorators**:
```typescript
@Controller('queues')
export class QueueController {
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateQueueDto) {
    return this.queueService.create(dto);
  }
}
```

---

## Architecture Patterns

### State Management (Pinia)
- One store per domain: auth, queue, settings
- Use composition API style
- Export typed interfaces for state

### API Communication
- All backend calls through `@/services/api.ts`
- Automatic token injection via interceptors
- Handle errors globally in interceptor

### Real-time Updates
- WebSocket events for queue changes
- Composable `useWebSocket()` for connection management
- Event naming: `entity:action` (e.g., `queue:created`)

### Database Patterns
- TypeORM with repository pattern
- Use `Between()` for date ranges
- Soft deletes not implemented (use status flags instead)

---

## Common Tasks

### Adding a New API Endpoint

1. Create DTO in service file or separate file:
```typescript
export interface CreateCategoryDto {
  name: string;
  prefix: string;
}
```

2. Add method to service:
```typescript
async create(dto: CreateCategoryDto): Promise<Category> {
  const category = this.repository.create(dto);
  return this.repository.save(category);
}
```

3. Add controller endpoint:
```typescript
@Post()
async create(@Body() dto: CreateCategoryDto) {
  return this.service.create(dto);
}
```

### Adding a New Vue Page

1. Create view in `frontend/src/views/PageName.vue`
2. Add route in `frontend/src/router/index.ts`:
```typescript
{
  path: '/page',
  name: 'page',
  component: () => import('@/views/PageName.vue'),
  meta: { requiresAuth: true }, // if needed
}
```

---

## Default Credentials

- **Admin**: username `admin`, password `admin123`
- Change in production!

---

## Environment Variables

### Backend
Create `backend/.env`:
```
JWT_SECRET=your-secret-key-change-in-production
PORT=3000
```

### Frontend
Environment handled by Vite. API proxy configured in `vite.config.ts`.

---

## Database Schema

See TypeORM entities in `backend/src/*/entity.ts`:
- **users**: Authentication and user management
- **categories**: Queue categories (prefix, name, description)
- **queues**: Queue tickets with status tracking
- **settings**: Key-value app configuration

---

## WebSocket Events

| Event | Payload | Description |
|-------|---------|-------------|
| `queue:created` | Queue | New ticket created |
| `queue:called` | Queue | Queue number called |
| `queue:completed` | Queue | Queue service completed |
| `queue:updated` | Queue | Queue status changed |
| `queue:reannounce` | Queue | Queue re-announcement triggered |

Listen via `useWebSocket()` composable.

---

## Deployment Notes

1. Build both frontend and backend
2. Backend serves on port 3000 (or PORT env var)
3. Frontend should proxy `/api/*` to backend or use NGINX
4. SQLite database persists in `backend/database.sqlite`
5. For production: Use PostgreSQL instead of SQLite
6. Set strong JWT_SECRET in environment
7. NEVER push code without asking

---

## Troubleshooting

**WebSocket not connecting**: Check CORS settings in `main.ts` and WebSocket URL in `useWebSocket.ts`

**Database errors**: Delete `database.sqlite` and restart backend (will reset all data)

**TypeScript errors**: Run `npm run type-check` to see all errors

**Print not working**: Browser print dialog requires HTTPS in some browsers

---

End of AGENTS.md
