// utils/convertToPersianNumber.ts

/**
 * Converts English digits to Persian digits
 * @param input - The input string or number to convert
 * @returns String with Persian digits
 */
export const toPersianNumber = (input: string | number): string => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    return String(input)
        .replace(/[0-9]/g, function(match) {
            return persianDigits[parseInt(match)];
        });
};

/**
 * Converts Persian digits to English digits
 * @param input - The input string with Persian digits
 * @returns String with English digits
 */
export const toEnglishNumber = (input: string): string => {
    return input
        .replace(/[۰-۹]/g, function(match) {
            return String('۰۱۲۳۴۵۶۷۸۹'.indexOf(match));
        });
};

/**
 * Format a number to a price format with comma separators
 * @param price - The price number
 * @param showToman - Whether to append "تومان" at the end
 * @returns Formatted price string
 */
export const formatPrice = (price: number, showToman = true): string => {
    const formatted = price.toLocaleString();
    return toPersianNumber(formatted) + (showToman ? ' تومان' : '');
};