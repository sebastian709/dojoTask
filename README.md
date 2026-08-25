# 🥋 DojoTask

DojoTask is a modern task and workspace management application built for organizing projects, tasks, and team collaboration.

The application uses a React frontend with AWS serverless services for authentication, APIs, database operations, and file storage.

---

## ✨ Features

### 🔐 Authentication

- User registration
- Login and logout
- OTP confirmation
- Amazon Cognito authentication
- Protected routes
- Persistent authentication state

### 👤 User Profiles

- Profile management
- Profile photo upload
- Profile photo cropping and zooming
- Profile photo removal
- Initial-based avatar fallback
- Personal information
- Professional information
- Searchable timezone selection

### 🏢 Workspaces

- Create workspaces
- View workspaces
- Workspace members
- Member roles
- Workspace-specific boards

### 📋 Boards & Tasks

- Boards inside workspaces
- Task lists
- Task management
- Task assignment
- Task threads
- Task activity tracking

### 📎 Attachments

- Upload task attachments
- S3 pre-signed upload URLs
- Attachment metadata
- View task attachments
- Remove attachments

### 🎨 UI / UX

- Dark modern interface
- Responsive desktop and mobile layouts
- Glass-style surfaces
- Responsive navigation
- Toast notifications
- Searchable dropdowns
- Image cropping interface

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Zustand
- Axios
- React Hot Toast
- React Easy Crop
- React Select
- Lucide React

### Backend / AWS

- Amazon Cognito
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- Amazon S3
- Amazon CloudWatch

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │    React + Vite     │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               │ HTTPS / JWT
                               ▼
                    ┌─────────────────────┐
                    │    API Gateway      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Lambda        │
                    │     Functions       │
                    └───────┬─────┬───────┘
                            │     │
                 ┌──────────┘     └──────────┐
                 ▼                            ▼
        ┌─────────────────┐          ┌─────────────────┐
        │    DynamoDB     │          │       S3        │
        │    Database     │          │  File Storage   │
        └─────────────────┘          └─────────────────┘
```

Authentication is handled by Amazon Cognito and authenticated API requests use JWT access tokens.

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── NavBar.jsx
│   ├── ProtectedRoute.jsx
│   └── PublicRoute.jsx
│
├── features/
│   ├── auth/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   │
│   └── profile/
│       └── services/
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   ├── WorkspacePage.jsx
│   ├── WorkspaceJoinPage.jsx
│   └── BoardPage.jsx
│
├── constants/
│   └── timezones.js
│
├── utils/
│   └── cropImage.js
│
├── routes/
│   └── routes.jsx
│
├── App.jsx
└── main.jsx
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Navigate to the project

```bash
cd dojotask
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_API_BASE=https://your-api-id.execute-api.ap-southeast-2.amazonaws.com
```

Configure the required AWS Cognito settings according to your environment.

### 5. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## 🔑 Authentication

DojoTask uses Amazon Cognito for authentication.

Authenticated requests retrieve the current user's access token and send it to API Gateway:

```js
const session = await fetchAuthSession();

const token =
  session.tokens?.accessToken?.toString();
```

The token is sent through the:

```http
Authorization
```

header.

---

## 🗄️ DynamoDB

The application uses DynamoDB for persistent application data.

Current tables include:

```text
dojotask-users
dojotask-workspace
dojotask-workspace-members
dojotask-board
dojotask-board-list
dojotask-list-task
dojotask-task-thread
dojotask-task-assignee
dojotask-task-attachment
dojotask-task-activity
```

---

## 🖼️ Profile Photo Upload

Profile photos are uploaded using an S3 pre-signed URL.

```text
User selects image
       │
       ▼
Image Cropper
       │
       ▼
Generate cropped image
       │
       ▼
Request pre-signed URL
       │
       ▼
AWS Lambda
       │
       ▼
Amazon S3
       │
       ▼
Save image URL
       │
       ▼
DynamoDB
       │
       ▼
Update Zustand store
       │
       ▼
Navbar updates automatically
```

Images are uploaded directly from the frontend to S3 using the temporary pre-signed URL.

---

## 📱 Responsive Design

DojoTask supports both desktop and mobile layouts.

Desktop interfaces use multi-column layouts where appropriate, while mobile layouts adapt into single-column views.

---

## 🎨 Design

DojoTask follows a dark, minimal interface.

| Purpose | Color |
|---|---|
| Background | `#0F1115` |
| Surface | `#161A22` |
| Elevated Surface | `#1C2230` |
| Primary | `#4F46E5` |
| Success | `#22C55E` |
| Highlight | `#F59E0B` |
| Primary Text | `#F1F5F9` |
| Secondary Text | `#94A3B8` |
| Muted Text | `#64748B` |

---

## 🧪 Development Status

DojoTask is currently under active development.

### Completed

- [x] Authentication
- [x] Registration
- [x] OTP confirmation
- [x] Protected routes
- [x] User profiles
- [x] Profile editing
- [x] Profile photo upload
- [x] Profile photo cropping
- [x] Profile photo removal
- [x] Workspace management
- [x] Workspace members
- [x] Boards
- [x] Tasks
- [x] Task assignments
- [x] Task threads
- [x] Task activity
- [x] Task attachments
- [x] S3 file uploads
- [x] Responsive navigation

### 🚧 In Progress

- [ ] Additional collaboration features
- [ ] UI/UX refinement
- [ ] Performance improvements
- [ ] Production deployment

---

## 🔒 Security

DojoTask uses:

- Amazon Cognito authentication
- JWT access tokens
- API Gateway authorization
- Protected application routes
- AWS Lambda
- S3 pre-signed URLs
- Direct frontend-to-S3 uploads

Sensitive environment variables should never be committed to the repository.

Make sure `.env` is included in `.gitignore`:

```gitignore
.env
.env.local
.env.*.local
```

---

## 📌 Project Goals

DojoTask is being developed with a functionality-first approach:

```text
Architecture
     ↓
Core Logic
     ↓
Backend Integration
     ↓
AWS Integration
     ↓
Testing
     ↓
UI/UX Refinement
     ↓
Production
```

The goal is to build a practical, scalable, and maintainable task management platform using modern frontend technologies and AWS serverless infrastructure.

---

## 👨‍💻 Developer

**Sebastian Jabson**

Web / Backend Developer

Built with:

```text
React
Vite
JavaScript
Tailwind CSS
Zustand
AWS Cognito
AWS Lambda
API Gateway
DynamoDB
S3
```

---

## 📄 License

This project is currently private and under active development.
