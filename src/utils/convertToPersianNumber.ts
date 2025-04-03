// utils/convertToPersianNumber.ts

/**
 * Converts English digits to Persian digits
 * @param input - The input string or number to convert
 * @param addCommas - Whether to add commas every 3 digits or not
 * @returns String with Persian digits
 */
export const toPersianNumber = (input: string | number, addCommas: boolean = true): string => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    // First convert to string and add commas if needed
    let stringValue = String(input);

    if (addCommas) {
        // Add commas for every 3 digits
        stringValue = stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Then convert digits to Persian
    return stringValue.replace(/[0-9]/g, function(match) {
        return persianDigits[parseInt(match)];
    });
};

export const formatJalaliDate = (dateStr: string) => {
    if (!dateStr) return "تاریخ نامشخص";

    // This is a simple implementation to convert numeric month to Persian month name
    const persianMonths = [
        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];

    // Extract components from jalali date string (assuming format like 1403-12-21)
    const parts = dateStr.split('-');
    if (parts.length !== 3) return toPersianNumber(dateStr, false);

    const year = toPersianNumber(parts[0], false);
    // Convert month number (1-12) to array index (0-11)
    const monthIndex = parseInt(parts[1]) - 1;
    const monthName = persianMonths[monthIndex] || '';
    const day = toPersianNumber(parts[2], false);

    return `${day} ${monthName} ${year}`;
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