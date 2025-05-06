import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Couses from './pages/courses/InitialCourses'
import ErrorPage from './pages/error/ErrorPage'
import Dashboard from './pages/admin/Dashboard'
import Events from './pages/events/InitialEvents'
import Courses from './pages/admin/compAdmin/Courses'
import EventsAdmin from './pages/admin/compAdmin/Events'
import UsersAdmin from './pages/admin/compAdmin/Users'
import FormEvents from './pages/Forms/FormEvents'
import FormCourse from './pages/Forms/FormCourse'
import FormUser from './pages/Forms/FormUser'

import UserProfile from './pages/profile/UserProfile'

import ConfirmEmail from './pages/mails/ConfirmEmail'

import UserRoute from './userAccess/ProtecedRoute/UserRoute'
import AdminRoute from './userAccess/ProtecedRoute/AdminRoute'
import { AuthProvider } from './userAccess/AuthProvider'

const router = createBrowserRouter([
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <Dashboard />
      </AdminRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: 'courses', element: <Courses />, errorElement: <ErrorPage /> },
      { path: 'events', element: <EventsAdmin />, errorElement: <ErrorPage /> },
      { path: 'users', element: <UsersAdmin />, errorElement: <ErrorPage /> },

      { path: 'createevent', element: <FormEvents />, errorElement: <ErrorPage /> },
      { path: 'createcourse', element: <FormCourse />, errorElement: <ErrorPage /> },
      { path: 'createuser', element: <FormUser />, errorElement: <ErrorPage /> },
    ]
  },
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/profile',
    element: (
      <UserRoute>
        <UserProfile />
      </UserRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/courses',
    element: (
      <UserRoute>
        <Couses />
      </UserRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/events',
    element: (
        <Events />
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/confirm-email',
    element: <ConfirmEmail />,
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
