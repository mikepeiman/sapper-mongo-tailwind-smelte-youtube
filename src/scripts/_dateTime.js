const dateTime = {
    getDate(date) {
        let x = new Date(date).toDateString();
        return x;
    },
    getTime(date) {
        let x = new Date(date).toLocaleTimeString();
        return x;
    },
    sortByMostRecent(arr) {
        let x = arr.sort((a, b) =>
            dateTime.getTime(a.snippet.position) > dateTime.getTime(b.snippet.position)
                ? 1
                : -1
        );
        return x;
    }
}

export default dateTime;
