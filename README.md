# Indian Mentors Web Application

A comprehensive Vue 3 application built with modern web technologies, featuring a complete mentoring platform with PWA capabilities, real-time notifications, and location-based services.

## 🚀 Features

- **Vue 3 with Composition API** - Modern reactive framework
- **Vuetify 3** - Material Design component library with custom theming
- **Pinia** - State management with TypeScript support
- **Vue Router** - Client-side routing with lazy loading
- **Axios** - HTTP client with interceptors and error handling
- **PWA Support** - Service worker, offline functionality, and app installation
- **Web Notifications** - Push notifications with permission handling
- **Location Services** - Geolocation with permission management
- **Dark/Light Theme** - Customizable theme switching
- **TypeScript** - Full type safety and IntelliSense support

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── AppLayout.vue   # Main application layout
│   └── PWAUpdatePrompt.vue # PWA update notifications
├── plugins/            # Plugin configurations
│   └── vuetify.ts     # Vuetify theme and configuration
├── router/             # Vue Router configuration
│   └── index.ts       # Routes with lazy loading and guards
├── services/           # API and external services
│   ├── api.ts         # Axios configuration with interceptors
│   ├── userService.ts # User-related API calls
│   └── pwaService.ts  # PWA update and offline handling
├── stores/             # Pinia stores for state management
│   ├── user.ts        # User authentication and profile
│   ├── theme.ts       # Theme switching (light/dark)
│   ├── notifications.ts # Notification management
│   └── location.ts    # Geolocation services
├── views/              # Page components
│   ├── DashboardView.vue    # Main dashboard
│   ├── ProfileView.vue      # User profile management
│   ├── SettingsView.vue     # Application settings
│   ├── LoginView.vue        # User authentication
│   ├── RegisterView.vue     # User registration
│   ├── PermissionView.vue   # Location permission request
│   └── NotFoundView.vue     # 404 error page
├── assets/             # Static assets
├── App.vue            # Root component
└── main.ts            # Application entry point
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18.20.5 or higher recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd IndianMentorsWeb
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=https://your-api-endpoint.com
   VITE_APP_NAME=Indian Mentors
   ```

### Development

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Theming & Customization

### Vuetify Theme Configuration

The application includes custom light and dark themes defined in `src/plugins/vuetify.ts`:

- **Primary Color**: #1976D2 (Light) / #2196F3 (Dark)
- **Secondary Color**: #424242
- **Custom accent colors** for different UI states

### Theme Switching

Users can toggle between light and dark themes using:

- Theme toggle button in the app bar
- Settings page theme controls
- Automatic system preference detection

## 🔐 Authentication & State Management

### User Store (Pinia)

The user store manages:

- Authentication state
- User profile data
- Location information
- Loading and error states

### API Integration

- **Axios interceptors** for automatic token handling
- **Error handling** with user-friendly messages
- **Request/response logging** for debugging
- **Automatic retry** for failed requests

## 📱 PWA Features

### Service Worker

- **Automatic updates** with user notification
- **Offline caching** for core app functionality
- **Background sync** for data synchronization
- **Push notifications** support

### Installation

Users can install the app on their devices:

- **Desktop**: Browser install prompt
- **Mobile**: Add to home screen
- **Standalone mode** with custom app icons

## 🔔 Notifications

### Web Notifications API

- **Permission request** with user-friendly UI
- **In-app notification panel** with read/unread status
- **Browser push notifications** for important updates
- **Notification history** and management

### Notification Types

- System updates
- Location changes
- User interactions
- Error alerts

## 📍 Location Services

### Geolocation Features

- **Permission management** with full-screen prompts
- **High-accuracy positioning** with fallback options
- **Location watching** for real-time updates
- **Error handling** with user-friendly messages

### Location Use Cases

- Find nearby mentors/mentees
- Location-based notifications
- Meeting scheduling
- Community features

## 🚦 Routing & Navigation

### Route Structure

- `/` - Dashboard (requires authentication)
- `/profile` - User profile management
- `/settings` - Application settings
- `/login` - User authentication
- `/register` - User registration
- `/permission` - Location permission request
- `/*` - 404 error page

### Route Guards

- **Authentication guards** for protected routes
- **Guest-only routes** for login/register
- **Permission checks** for location-based features

## 🔧 API Configuration

### Base Configuration

```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### Interceptors

- **Request interceptor**: Adds authentication tokens
- **Response interceptor**: Handles errors and logging
- **Error handling**: User-friendly error messages

## 📊 Sample Data & Demo

The application includes sample data for demonstration:

- **Dashboard analytics** with progress indicators
- **Sample API calls** to JSONPlaceholder
- **Mock user data** for testing
- **Notification examples**

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

### Deployment Options

- **Static hosting** (Netlify, Vercel, GitHub Pages)
- **CDN deployment** for global distribution
- **Docker containerization** for server deployment

### Environment Variables

```env
VITE_API_BASE_URL=https://api.indianmentors.com
VITE_APP_NAME=Indian Mentors
VITE_APP_VERSION=1.0.0
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added PWA support and notifications
- **v1.2.0** - Enhanced location services and theming

---

Built with ❤️ using Vue 3, Vuetify, and modern web technologies.
# indianmentors-web-v2
