import App from './App.jsx';
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
                path: '/signup',
                element:<SignupPage />
            }
        ],
    },
];
