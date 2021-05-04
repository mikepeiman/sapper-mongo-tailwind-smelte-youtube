export default function lsget(item) {
    let ls = localStorage.getItem(item);
    if (ls) {
        if (ls != "undefined") {
            return JSON.parse(ls);
        } else {
            return ls
        }

    } else {
        return false;
    }
}