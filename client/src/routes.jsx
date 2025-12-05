import App from './App.jsx';
import { CheatForm } from './components/CheatForm.jsx';
import { DevTools } from './pages/DevTools.jsx';
import { ErrorPage } from './pages/ErrorPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { SignupPage } from './pages/SignupPage.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';


export const routes = [
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: 
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>,
            },
            {
                path: '/devtools',
                element: <ProtectedRoute><DevTools /></ProtectedRoute>
            },
            {
                path: '/login',
                element: <LoginPage />
            },{
                path: '/cheats',
                element: <ProtectedRoute><CheatForm /></ProtectedRoute>
            },
            {
                path: '/cheats/:id/edit',
                element: <ProtectedRoute><CheatForm /></ProtectedRoute>
            },
            {
                path: '/signup',
                element:<SignupPage />
            }
        ],
    },
];
