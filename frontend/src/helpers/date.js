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