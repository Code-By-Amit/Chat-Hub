

export const formattedTime = (time) => {

    const msgDate = new Date(time);
    const now = new Date();

    // Check if msgDate is today
    const isToday = msgDate.toDateString() === now.toDateString();

    const formattedTime = isToday
        ? msgDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
        : msgDate.toLocaleDateString('en-US');

        return formattedTime
}