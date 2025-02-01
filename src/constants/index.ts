export const NAVBAR_ITEMS = ['خانه', 'درباره ما', 'وبلاگ', 'داستان'];

export const ROUTES = {
    HOME: '/',
    BLOG: '/blog',
    BLOG_DETAILS: '/blog/:id',
    STORY: '/story',
    SHOP: '/shop',
    PRODUCT_DETAILS: '/shop/product/:id',
};

export const UI_CONSTANTS = {
    LOADING_MESSAGE: 'در حال بارگذاری...',
    ERROR_MESSAGE: 'مشکلی در دریافت اطلاعات رخ داده است.',
    NOT_FOUND_MESSAGE: 'مورد مورد نظر یافت نشد.',
};

export const THEME = {
    colors: {
        primary: '#345BC0',
        secondary: '#018A08',
        background: '#F4F4F4',
        text: {
            primary: '#2B463C',
            secondary: '#666',
        },
        button: {
            primary: '#007bff',
            secondary: '#80D46D',
        },
    },
    borderRadius: {
        small: '4px',
        medium: '10px',
        large: '20px',
        circle: '50%',
    },
    fontFamily: {
        primary: 'shoor-Medium, Arial, sans-serif',
        secondary: 'Yekan, Arial, sans-serif',
    },
};