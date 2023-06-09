export function secondsToHumanReadable(seconds) {
    // hh hours, mm minutes, ss seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - (hours * 3600)) / 60);
    const secs = seconds - (hours * 3600) - (minutes * 60);

    let humanReadable = '';
    if (hours > 0) {
        humanReadable += hours + 'h ';
    }
    if (minutes > 0) {
        humanReadable += minutes + 'm ';
    }
    if (secs > 0) {
        humanReadable += secs + 's';
    }
    return humanReadable;
}