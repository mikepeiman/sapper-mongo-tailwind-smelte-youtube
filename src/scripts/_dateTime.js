const dateTime = {
    getDate(date) {
        let x = new Date(date).toDateString();
        return x;
    },
    getTime(date) {
        let x = new Date(date).toLocaleTimeString();
        return x;
    },
    sortByMostRecent(arr, listType) {
        console.log(`🚀 ~ file: _dateTime.js ~ line 11 ~ sortByMostRecent ~ listType`, listType)
        if(listType == "playlistsList"){
        console.log(`🚀 ~ file: _dateTime.js ~ line 11 ~ sortByMostRecent ~ arr`, arr)

            return arr.reverse()
        }
        let x = arr.sort((a, b) =>
            dateTime.getTime(a.snippet.position) > dateTime.getTime(b.snippet.position)
                ? 1
                : -1
        );
        return x;
    }
}

export default dateTime;
