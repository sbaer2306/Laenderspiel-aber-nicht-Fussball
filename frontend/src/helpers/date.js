/**
 * Convert dateTime to german format.
 * 
 * @param {2023-06-07T06:50:50.292Z} dateString 
 * @returns Date in german format
 */
export function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    };
    return date.toLocaleDateString('de-DE', options);
}

/**
 * Convert dateTime to german format.
 * @param {DateTime like "2023-06-07T07:15:17.813Z"} dateString to be formatted
 * @returns DateTime in german format
 */
export function formatDateTime(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'Europe/Berlin' };
    return date.toLocaleDateString('en-DE', options);
}