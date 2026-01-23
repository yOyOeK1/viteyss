 function msToDurationString(sec) {
        let ms = parseInt(parseFloat(sec) * 1000.00);
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        const remainingHours = hours % 24;
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;
        const remainingMs = ms % 1000;

        if (days > 0) {
            return `${days}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
        } else if (hours > 0) {
            return `${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
        } else if (minutes > 0) {
            return `${remainingMinutes}m ${remainingSeconds}s`;
        } else if (seconds > 0) {
            return `${remainingSeconds}.${String(remainingMs).padStart(3, '0')}s`;
        } else {
            return `${ms}ms`;
        }
}


export { msToDurationString }