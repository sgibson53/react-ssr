import HomePage from './pages/HomePage';
import UsersListPage from './pages/UsersListPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminsListPage from './pages/AdminsListPage';
import App from './App';


export default [
    {
        ...App, // no path means it will always be displayed on the screen
        routes: [
            {
                path: '/',
                ...HomePage,
                exact: true
            },
            {
                path: '/admins',
                ...AdminsListPage
            },
            {
                path: '/users',
                ...UsersListPage
            },
            {
                ...NotFoundPage
            }
        ]
    }
]