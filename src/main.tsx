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
import UsersApplied from './pages/admin/compAdmin/UsersApplied'
import FormEvents from './pages/Forms/FormEvents'
import FormCourse from './pages/Forms/FormCourse'
import FormUser from './pages/Forms/FormUser'

import ApplyUsers from "./pages/profile/ApplyUsers"

import UserProfile from './pages/profile/UserProfile'

import ConfirmEmail from './pages/mails/ConfirmEmail'

import { AuthProvider } from './userAccess/AuthProvider'

const router = createBrowserRouter([
  {
    path: '/admin',
    element: (
        <Dashboard />
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: 'courses', element: <Courses />, errorElement: <ErrorPage /> },
      { path: 'applieds', element: <UsersApplied />, errorElement: <ErrorPage /> },
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
          <UserProfile />
    ),
    errorElement: <ErrorPage />,
  },
    {
    path: "apply/:id", 
    element: <ApplyUsers />,
    errorElement: <ErrorPage /> 
  },
  {
    path: '/courses',
    element: (
          <Couses />
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
