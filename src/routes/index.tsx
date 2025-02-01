import { RouteObject } from 'react-router-dom';
import BlogPage from '../pages/BlogPage';
import BlogDetails from '../pages/BlogDetails';
import StoryPage from '../pages/Story';
import ProductsPage from '../pages/ProductsPage';
import ProductDetails from '../pages/ProductDetails';
import { ROUTES } from '../constants';

export const routes: RouteObject[] = [
    {
        path: ROUTES.HOME,
        element: <BlogPage />,
    },
    {
        path: ROUTES.BLOG_DETAILS,
        element: <BlogDetails />,
    },
    {
        path: ROUTES.STORY,
        element: <StoryPage />,
    },
    {
        path: ROUTES.SHOP,
        element: <ProductsPage />,
    },
    {
        path: ROUTES.PRODUCT_DETAILS,
        element: <ProductDetails />,
    },
];