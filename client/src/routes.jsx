import App from './App.jsx';
import { CheatForm } from './components/CheatForm.jsx';
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
            },{
                path: '/login',
                element: <LoginPage />
            },{
                path: '/cheats',
                element: <CheatForm />
            },
            {
                path: '/cheats/:id/edit',
                element: <CheatForm />
            },
            {
                path: '/signup',
                element:<SignupPage />
            }
        ],
    },
];
