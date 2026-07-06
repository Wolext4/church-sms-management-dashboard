# Church SMS Management Dashboard - Setup Guide

## Overview

This is a feature-complete Church SMS Management Dashboard built with Next.js 16, Zustand for state management, and connects to an external REST API for backend operations.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with notification container
│   ├── page.tsx               # Home page (redirects to dashboard or login)
│   ├── login/                 # Login page
│   ├── register/              # Registration page
│   ├── forgot-password/       # Password reset page
│   └── dashboard/
│       ├── layout.tsx         # Dashboard protected layout
│       ├── page.tsx           # Dashboard home with stats
│       ├── sms/
│       │   ├── quick-send/    # Send single SMS
│       │   ├── bulk-send/     # Send to multiple recipients
│       │   ├── templates/     # SMS template management
│       │   └── history/       # SMS sending history
│       ├── credits/           # Credit management and purchasing
│       ├── users/             # Team member management
│       ├── church/            # Church info and member management
│       ├── audit-logs/        # System audit trail
│       └── settings/          # User preferences
├── components/
│   ├── auth/                  # Authentication components
│   ├── dashboard/             # Dashboard layout components
│   ├── notifications/         # Toast notification system
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── api.ts                 # Axios API client with all endpoints
│   ├── config.ts              # API configuration
│   ├── types.ts               # TypeScript type definitions
│   └── store/                 # Zustand stores
│       ├── auth.ts            # Authentication state
│       ├── sms.ts             # SMS management state
│       ├── credits.ts         # Credits state
│       └── notifications.ts   # Notification state
└── public/                    # Static assets
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.your-domain.com/v1
```

Replace `https://api.your-domain.com/v1` with your actual API endpoint.

## API Integration

The application expects the following API endpoints (defined in `lib/config.ts`):

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/verify-email` - Email verification
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/logout` - Logout

### SMS Management
- `POST /sms/send` - Send quick SMS
- `POST /sms/bulk-send` - Send bulk SMS
- `GET /sms/templates` - Get all templates
- `POST /sms/templates` - Create template
- `PUT /sms/templates/:id` - Update template
- `DELETE /sms/templates/:id` - Delete template
- `GET /sms/history` - Get SMS history
- `GET /sms/history/:id` - Get SMS history detail

### Credits
- `GET /credits/balance` - Get credit balance
- `GET /credits/packages` - Get available packages
- `POST /credits/purchase` - Purchase credits
- `GET /credits/history` - Get transaction history

### Users
- `GET /users` - List users
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/profile` - Get current user profile

### Church
- `GET /church/info` - Get church information
- `PUT /church/info` - Update church information
- `GET /church/members` - Get church members
- `GET /church/groups` - Get church groups

### Audit Logs
- `GET /audit-logs` - Get audit logs

### Settings
- `GET /settings` - Get user settings
- `PUT /settings` - Update user settings

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

## API Response Format

All API responses should follow this format:

```json
{
  "success": true,
  "data": { /* response data */ }
}
```

For errors:
```json
{
  "success": false,
  "error": "Error message"
}
```

For paginated responses:
```json
{
  "success": true,
  "data": {
    "data": [ /* array of items */ ],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "hasMore": true
  }
}
```

## Authentication Flow

1. User logs in with email/password
2. Server returns `accessToken`, `refreshToken`, and `user` object
3. Tokens are stored in localStorage
4. `accessToken` is automatically injected in Authorization header for all requests
5. If request returns 401, user is redirected to login

## Features

### Authentication
- Login with email/password
- User registration
- Password recovery
- Protected routes

### SMS Management
- Quick send to single recipient
- Bulk send to multiple recipients
- SMS template creation and management
- SMS history and detailed logs

### Credit Management
- View available credits
- Purchase credit packages
- Track transaction history
- Real-time balance updates

### User Management
- Add/remove team members
- Assign roles (Admin, User, Viewer)
- Manage user permissions

### Church Management
- Update church information
- View and manage church members
- Organize members into groups
- Track member join dates

### Audit Logging
- Track all system activities
- View action history
- Monitor user activities by IP and user agent

### Settings
- Theme preference (light/dark/auto)
- Language selection
- Timezone configuration
- Notification preferences

## State Management with Zustand

All stores are defined in `lib/store/`:

### Auth Store
```typescript
useAuthStore() - Manages authentication state and actions
```

### SMS Store
```typescript
useSMSStore() - Manages SMS operations and templates
```

### Credits Store
```typescript
useCreditsStore() - Manages credit balance and transactions
```

### Notifications Store
```typescript
useNotificationsStore() - Manages toast notifications
```

## Running the Application

### Development
```bash
pnpm install
pnpm dev
```

The app will be available at `http://localhost:3000`

### Production Build
```bash
pnpm build
pnpm start
```

## Default Routes

- `/` - Redirects to `/dashboard` if authenticated, `/login` otherwise
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password recovery
- `/dashboard` - Main dashboard
- `/dashboard/sms/*` - SMS management features
- `/dashboard/credits` - Credit management
- `/dashboard/users` - User management
- `/dashboard/church` - Church management
- `/dashboard/audit-logs` - Audit logs
- `/dashboard/settings` - User settings

## Customization

### API Endpoint
Update `lib/config.ts` to change the API base URL or add/remove endpoints

### Theme Colors
Colors are defined using Tailwind CSS classes. Main color scheme:
- Primary: Blue (`bg-blue-600`, `text-blue-600`)
- Success: Green (`bg-green-50`, `text-green-600`)
- Error: Red (`bg-red-50`, `text-red-600`)
- Warning: Yellow (`bg-yellow-50`, `text-yellow-600`)

### Components
All UI components are in `components/ui/` from shadcn/ui. Add more components as needed using shadcn CLI:

```bash
pnpm exec shadcn-ui@latest add [component-name]
```

## Security Considerations

1. **Token Storage**: Tokens are stored in localStorage. For production, consider using httpOnly cookies.
2. **CORS**: Make sure your API is configured to accept requests from your frontend domain.
3. **Rate Limiting**: Implement rate limiting on the API side to prevent abuse.
4. **Input Validation**: All forms include basic client-side validation. Always validate on the server.
5. **Authentication**: Ensure all protected routes verify the user is authenticated.

## Troubleshooting

### API Calls Returning 401
- Check that `NEXT_PUBLIC_API_URL` is correct
- Verify that the authentication token is being stored properly
- Check browser console for token-related errors

### Components Not Rendering
- Ensure all imports are correct
- Check that components are exported properly
- Verify shadcn components are installed

### State Not Updating
- Verify Zustand store methods are called correctly
- Check browser React DevTools for state changes
- Ensure components are not creating new store instances

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variables in project settings
4. Deploy

### Other Platforms
Follow the standard Next.js deployment guide for your platform.

## Support

For issues or questions, check:
1. Next.js documentation: https://nextjs.org/docs
2. Zustand documentation: https://github.com/pmndrs/zustand
3. shadcn/ui documentation: https://ui.shadcn.com
4. Tailwind CSS documentation: https://tailwindcss.com
