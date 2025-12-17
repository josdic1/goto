import App from './App.jsx';
import { CheatForm } from './components/CheatForm.jsx';
import { CheatCard } from './components/CheatCard.jsx';
import { CheatView } from './pages/CheatView.jsx';
import { DevTools } from './pages/DevTools.jsx';
import { ErrorPage } from './pages/ErrorPage.jsx';
import { Generator } from './pages/Generator.jsx';
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
            ,{
                path: '/generator',
                element: <ProtectedRoute><Generator /></ProtectedRoute>
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
            path: '/cheats/:id',
                element: <ProtectedRoute><CheatView /></ProtectedRoute>
            },
            {
                path: '/signup',
                element:<SignupPage />
            }
        ],
    },
];
