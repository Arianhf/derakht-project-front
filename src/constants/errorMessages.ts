/**
 * Error Messages
 *
 * This file contains all user-facing error messages in Persian.
 * Messages support parameter substitution using {paramName} syntax.
 */

import { ErrorCode } from '@/types/error';

/**
 * Error message template type
 */
export type ErrorMessageTemplate = string | ((details?: any) => string);

/**
 * User-facing error messages in Persian
 */
export const ERROR_MESSAGES: Record<string, ErrorMessageTemplate> = {
  // Validation Errors
  [ErrorCode.INVALID_EMAIL]: 'فرمت ایمیل نامعتبر است',
  [ErrorCode.INVALID_PASSWORD]: 'رمز عبور نامعتبر است',
  [ErrorCode.PASSWORD_TOO_SHORT]: (details?: any) =>
    `رمز عبور باید حداقل ${details?.limit || 8} کاراکتر باشد`,
  [ErrorCode.PASSWORD_TOO_WEAK]:
    'رمز عبور باید شامل حروف بزرگ، کوچک و عدد باشد',
  [ErrorCode.PASSWORDS_DO_NOT_MATCH]: 'رمز عبور و تکرار آن یکسان نیستند',
  [ErrorCode.INVALID_PHONE]: 'شماره تلفن نامعتبر است',
  [ErrorCode.INVALID_POSTAL_CODE]: 'کد پستی نامعتبر است',
  [ErrorCode.REQUIRED_FIELD]: (details?: any) =>
    details?.field
      ? `فیلد ${getFieldName(details.field)} الزامی است`
      : 'این فیلد الزامی است',
  [ErrorCode.INVALID_FORMAT]: (details?: any) =>
    details?.field
      ? `فرمت ${getFieldName(details.field)} نامعتبر است`
      : 'فرمت ورودی نامعتبر است',
  [ErrorCode.VALUE_TOO_LONG]: (details?: any) =>
    `حداکثر ${details?.limit || 255} کاراکتر مجاز است`,
  [ErrorCode.VALUE_TOO_SHORT]: (details?: any) =>
    `حداقل ${details?.limit || 1} کاراکتر لازم است`,
  [ErrorCode.INVALID_AGE]: 'سن وارد شده نامعتبر است',
  [ErrorCode.AGE_TOO_YOUNG]: (details?: any) =>
    `حداقل سن مجاز ${details?.limit || 3} سال است`,

  // Authentication Errors
  [ErrorCode.INVALID_CREDENTIALS]: 'ایمیل یا رمز عبور اشتباه است',
  [ErrorCode.EMAIL_ALREADY_EXISTS]:
    'این ایمیل قبلاً ثبت شده است. لطفاً وارد شوید',
  [ErrorCode.USER_NOT_FOUND]: 'کاربر یافت نشد',
  [ErrorCode.SESSION_EXPIRED]: 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید',
  [ErrorCode.TOKEN_INVALID]: 'توکن نامعتبر است. لطفاً دوباره وارد شوید',
  [ErrorCode.TOKEN_EXPIRED]: 'توکن منقضی شده است. لطفاً دوباره وارد شوید',

  // Authorization Errors
  [ErrorCode.UNAUTHORIZED]:
    'برای دسترسی به این صفحه باید وارد حساب کاربری خود شوید',
  [ErrorCode.FORBIDDEN]: 'شما اجازه دسترسی به این بخش را ندارید',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]:
    'دسترسی شما برای انجام این عملیات کافی نیست',

  // Business Logic Errors
  [ErrorCode.PRODUCT_OUT_OF_STOCK]: (details?: any) =>
    details?.productName
      ? `محصول ${details.productName} موجود نیست`
      : 'این محصول موجود نیست',
  [ErrorCode.PRODUCT_NOT_FOUND]: 'محصول مورد نظر یافت نشد',
  [ErrorCode.CART_EMPTY]: 'سبد خرید شما خالی است',
  [ErrorCode.CART_ITEM_NOT_FOUND]: 'محصول مورد نظر در سبد خرید یافت نشد',
  [ErrorCode.INVALID_QUANTITY]: (details?: any) => {
    if (details?.max) {
      return `حداکثر تعداد قابل سفارش: ${details.max}`;
    }
    return 'تعداد وارد شده نامعتبر است';
  },
  [ErrorCode.ORDER_NOT_FOUND]: 'سفارش مورد نظر یافت نشد',
  [ErrorCode.PAYMENT_FAILED]:
    'پرداخت ناموفق بود. لطفاً دوباره تلاش کنید یا از روش پرداخت دیگری استفاده کنید',
  [ErrorCode.PAYMENT_VERIFICATION_FAILED]:
    'تایید پرداخت با خطا مواجه شد. در صورت کسر وجه، مبلغ طی 72 ساعت بازگردانده می‌شود',
  [ErrorCode.PAYMENT_CANCELLED]: 'پرداخت توسط کاربر لغو شد',
  [ErrorCode.SHIPPING_ADDRESS_REQUIRED]:
    'لطفاً آدرس ارسال را وارد کنید',
  [ErrorCode.INVALID_SHIPPING_ADDRESS]: 'آدرس ارسال نامعتبر است',
  [ErrorCode.COMMENT_TOO_SHORT]: (details?: any) =>
    `نظر شما باید حداقل ${details?.limit || 10} کاراکتر باشد`,
  [ErrorCode.COMMENT_TOO_LONG]: (details?: any) =>
    `نظر شما نباید بیشتر از ${details?.limit || 1000} کاراکتر باشد`,
  [ErrorCode.COMMENT_NOT_FOUND]: 'نظر مورد نظر یافت نشد',
  [ErrorCode.COMMENT_SUBMIT_FAILED]: 'ارسال نظر با خطا مواجه شد. لطفاً دوباره تلاش کنید',

  // Rate Limiting Errors
  [ErrorCode.RATE_LIMIT_EXCEEDED]: (details?: any) => {
    if (details?.retryAfter) {
      const minutes = Math.ceil(details.retryAfter / 60);
      return `تعداد درخواست‌های شما از حد مجاز گذشته است. لطفاً ${minutes} دقیقه دیگر تلاش کنید`;
    }
    return 'تعداد درخواست‌های شما از حد مجاز گذشته است. لطفاً کمی صبر کنید';
  },
  [ErrorCode.TOO_MANY_REQUESTS]:
    'درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید',
  [ErrorCode.TOO_MANY_LOGIN_ATTEMPTS]: (details?: any) => {
    if (details?.retryAfter) {
      const minutes = Math.ceil(details.retryAfter / 60);
      return `تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً ${minutes} دقیقه دیگر تلاش کنید`;
    }
    return 'تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً کمی صبر کنید';
  },

  // Network Errors
  [ErrorCode.NETWORK_ERROR]:
    'خطا در برقراری ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید',
  [ErrorCode.TIMEOUT_ERROR]:
    'زمان درخواست به پایان رسید. لطفاً دوباره تلاش کنید',
  [ErrorCode.CONNECTION_ERROR]:
    'خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید',

  // Server Errors
  [ErrorCode.SERVER_ERROR]:
    'خطای سرور رخ داده است. لطفاً بعداً دوباره تلاش کنید',
  [ErrorCode.SERVICE_UNAVAILABLE]:
    'سرویس در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید',
  [ErrorCode.DATABASE_ERROR]:
    'خطا در پردازش اطلاعات. لطفاً بعداً تلاش کنید',

  // Unknown/Generic Errors
  [ErrorCode.UNKNOWN_ERROR]:
    'خطای نامشخصی رخ داده است. لطفاً دوباره تلاش کنید',
  [ErrorCode.UNEXPECTED_ERROR]:
    'خطای غیرمنتظره‌ای رخ داده است. لطفاً با پشتیبانی تماس بگیرید',
};

/**
 * Suggested actions for different error types
 * These provide helpful guidance to users on how to resolve errors
 */
export const ERROR_ACTIONS: Record<string, string> = {
  [ErrorCode.INVALID_CREDENTIALS]: 'رمز عبور خود را فراموش کرده‌اید؟',
  [ErrorCode.EMAIL_ALREADY_EXISTS]: 'وارد شوید',
  [ErrorCode.SESSION_EXPIRED]: 'ورود مجدد',
  [ErrorCode.TOKEN_EXPIRED]: 'ورود مجدد',
  [ErrorCode.UNAUTHORIZED]: 'ورود به حساب کاربری',
  [ErrorCode.PRODUCT_OUT_OF_STOCK]: 'مشاهده محصولات مشابه',
  [ErrorCode.PAYMENT_FAILED]: 'تلاش مجدد',
  [ErrorCode.NETWORK_ERROR]: 'تلاش مجدد',
  [ErrorCode.TIMEOUT_ERROR]: 'تلاش مجدد',
  [ErrorCode.SERVER_ERROR]: 'تلاش مجدد',
};

/**
 * Determines which errors can be retried
 */
export const RETRYABLE_ERRORS = new Set([
  ErrorCode.NETWORK_ERROR,
  ErrorCode.TIMEOUT_ERROR,
  ErrorCode.CONNECTION_ERROR,
  ErrorCode.SERVICE_UNAVAILABLE,
  ErrorCode.SERVER_ERROR,
]);

/**
 * Maps field names to Persian labels for better error messages
 */
const FIELD_NAME_MAP: Record<string, string> = {
  email: 'ایمیل',
  password: 'رمز عبور',
  confirmPassword: 'تکرار رمز عبور',
  name: 'نام',
  firstName: 'نام',
  lastName: 'نام خانوادگی',
  phone: 'شماره تلفن',
  mobile: 'شماره موبایل',
  address: 'آدرس',
  city: 'شهر',
  state: 'استان',
  postalCode: 'کد پستی',
  age: 'سن',
  title: 'عنوان',
  description: 'توضیحات',
  quantity: 'تعداد',
  price: 'قیمت',
  comment: 'نظر',
  text: 'متن',
};

/**
 * Helper function to get Persian field name
 */
function getFieldName(field: string): string {
  return FIELD_NAME_MAP[field] || field;
}

/**
 * Default fallback messages for different environments
 */
export const FALLBACK_MESSAGES = {
  production: 'خطایی رخ داده است. لطفاً دوباره تلاش کنید',
  development: 'خطای نامشخص: ',
};
