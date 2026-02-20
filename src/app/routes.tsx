import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { Home } from './screens/Home';
import { Thread } from './screens/Thread';
import { CreatePost } from './screens/CreatePost';
import { Notifications } from './screens/Notifications';
import { Badges } from './screens/Badges';
import { Search } from './screens/Search';
import { Recommended } from './screens/Recommended';
import { NotFound } from './screens/NotFound';
import { Auth } from './screens/Auth';
import { Profile } from './screens/Profile';

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'thread/:id', element: <Thread /> },
      { path: 'create', element: <CreatePost /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'badges', element: <Badges /> },
      { path: 'search', element: <Search /> },
      { path: 'recommended', element: <Recommended /> },
      { path: 'profile', element: <Profile /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);