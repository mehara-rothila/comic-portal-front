# 🦸‍♂️ COMIC PORTAL - USER GUIDE 🦸‍♀️

<div align="center">
  
**Your digital gateway to endless comic adventures!**

</div>

---

## 🚀 WELCOME TO COMIC PORTAL!

Comic Portal is an immersive web application designed for comic enthusiasts to discover, purchase, and manage their digital comic collection. This vibrant platform brings together comic lovers and creators in a colorful, user-friendly interface.

---

## 📑 WHAT'S INSIDE

- [🔥 Getting Started](#-getting-started)
- [🧭 Finding Your Way](#-finding-your-way)
- [🎭 Features for Comic Fans](#-features-for-comic-fans)
- [⚙️ Admin Superpowers](#-admin-superpowers)
- [🔐 Account Management](#-account-management)
- [💻 Technical Setup](#-technical-setup)

---

## 🔥 GETTING STARTED

### System Requirements
- 🌐 Modern web browser (Chrome, Firefox, Safari, Edge)
- 📱 Works on desktop and mobile devices
- ✅ JavaScript enabled

### First-time Login
1. Visit the Comic Portal website
2. Register for a new account or login with existing credentials
3. Start exploring the colorful world of comics!

---

## 🧭 FINDING YOUR WAY

### The Navigation Bar
The vibrant yellow navigation bar at the top is your command center:

- **🏠 Home** - Your starting point with featured comics and latest releases
- **📚 Categories** - Dropdown menu to filter comics by genre or theme
- **🔥 Bestsellers** - Most popular comics that are trending right now
- **✨ New Arrivals** - Fresh comics just added to the portal
- **📂 My Comics** - Your personal collection (visible when logged in)
- **🛠️ Admin Panel** - Special controls for administrators

### The Home Page
The homepage features:
- 🎯 Highlighted featured comics in a dynamic carousel
- 🏷️ Quick-access category tiles for easy navigation
- 🆕 Latest comics section showing new additions
- 🔍 Intuitive interface with vibrant visual cues

---

## 🎭 FEATURES FOR COMIC FANS

### Browsing Comics
- **Filter by Category**: Find comics that match your interests
- **Sort Options**: Arrange by popularity, price, or release date
- **Visual Grid**: Browse through comic covers in an attractive layout
- **Quick Info**: See price, author, and status at a glance

### Viewing Comic Details
Click on any comic to reveal:
- 📖 Comprehensive description
- 👤 Author information
- 💰 Pricing details
- 🏷️ Genre classification
- 📊 Publication status

### My Comics
After purchasing, your comics appear in the "My Comics" section:
- 📚 Easy access to your purchased collection
- 📱 Read comics directly in your browser
- 🔖 Track your reading progress
- ⭐ Mark favorites for quick access

---

## ⚙️ ADMIN SUPERPOWERS

### Admin Dashboard
Administrators get access to a powerful dashboard with:
- 📊 Statistics on total comics, users, and published content
- 📈 Quick overview of site performance
- 🎛️ Full management capabilities

### Managing Comics
From the admin panel, you can:
- ➕ Add new comics with the "Add New Comic" button
- ✏️ Edit existing comics to update information
- 🗑️ Delete comics that are no longer needed
- 🌟 Mark comics as "Featured" to highlight them
- 📝 Change status between "Draft" and "Published"

To add or edit a comic:
1. Fill in the comic details (title, author, description, etc.)
2. Upload a cover image (optional but recommended)
3. Set pricing and categorization
4. Choose publication status
5. Save your changes

---

## 🔐 ACCOUNT MANAGEMENT

### Registration
New to Comic Portal? Create your account:
1. Click "Register" in the top navigation bar
2. Enter your name, email, and create a password
3. Submit the form to create your account
4. Start exploring immediately!

### Login
Already have an account?
1. Click "Login" in the navigation bar
2. Enter your email and password
3. Access your comics and personalized features

### Logout
To securely exit your account:
- Click "Logout" in the navigation bar
- Your session will end, securing your account

---

## 💻 TECHNICAL SETUP

For developers and self-hosting enthusiasts:

### Technology Stack
- 🖼️ **Frontend**: Vue.js 3 with Composition API
- 🧩 **State Management**: Pinia
- 🌐 **Routing**: Vue Router
- 🎨 **Styling**: Tailwind CSS
- 🔄 **HTTP Client**: Axios
- 🛠️ **Build Tool**: Vite

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/comic-portal.git

# Navigate to project directory
cd comic-portal

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Configuration
Create a `.env` file in the root directory to configure environment variables:

```
VITE_APP_TITLE=Comic Portal
VITE_BACKEND_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

The application reads these variables to configure itself accordingly.

### API Integration
The application connects to a backend API at `http://localhost:8000/api` by default. To change this:
1. Update the baseURL in `src/services/api.js`
2. Ensure CORS is properly configured on your backend

The API service includes:
- Request/response interceptors for handling auth tokens
- Error handling mechanisms
- FormData support for file uploads
- Custom utilities for common operations

### Authentication Flow
Authentication is handled through JWT tokens:
1. Tokens are stored in localStorage
2. Request interceptors automatically attach tokens to API calls
3. Response interceptors handle token expiration
4. Protected routes are guarded by router navigation guards

### Project Structure
```
comic-portal/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and other resources
│   ├── components/      # Reusable UI components
│   │   ├── AdminDashboard.vue
│   │   ├── ComicFormModal.vue
│   │   └── NavBar.vue
│   ├── config/          # Configuration files
│   │   └── categories.js
│   ├── router/          # Navigation configuration
│   │   └── index.js
│   ├── services/        # API and external services
│   │   └── api.js
│   ├── stores/          # Pinia state management
│   │   ├── auth.js
│   │   └── comic.js
│   ├── views/           # Page components
│   │   ├── AdminPanel.vue
│   │   ├── ComicDetail.vue
│   │   ├── ComicList.vue
│   │   ├── HomeView.vue
│   │   ├── Login.vue
│   │   ├── MyComics.vue
│   │   ├── NotFound.vue
│   │   └── Register.vue
│   ├── App.vue          # Root component
│   └── main.js          # Application entry point
├── .env                 # Environment variables
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite configuration
```

### Key Components
- **NavBar.vue**: Main navigation component with dynamic links based on auth state
- **ComicFormModal.vue**: Reusable form for creating and editing comics
- **AdminDashboard.vue**: Dashboard interface for admin users

### State Management
Pinia stores organize application state:
- **auth.js**: Handles user authentication, profile, and permissions
- **comic.js**: Manages comic data, categories, and filtering

### Styling System
Tailwind CSS is used throughout the application with:
- Custom color scheme (primarily yellow-based for comic theme)
- Responsive design for mobile and desktop
- Custom utility classes for common patterns

### Backend Requirements
The backend API should provide these endpoints:
- Authentication: `/api/login`, `/api/register`, `/api/logout`
- User: `/api/user`, `/api/check-admin`
- Comics: `/api/comics`, `/api/comics/:id`, `/api/comics/featured`
- Admin: `/api/admin/comics`, `/api/admin/stats`

### Deployment
For production deployment:
1. Build the application: `npm run build`
2. Deploy the contents of the `dist` directory to your web server
3. Configure your web server to handle SPA routing (redirect 404s to index.html)

### Extending the Application
To add new features:
1. Create new component(s) in the appropriate directory
2. Update or create Pinia stores as needed
3. Add routes in the router configuration if necessary
4. Implement API endpoints in the backend
5. Update navigation or UI to access new features

---

<div align="center">

**Happy Comic Reading! 📚✨**

</div>
