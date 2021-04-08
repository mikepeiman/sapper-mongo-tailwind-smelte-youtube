export default function lsget(item) {
    let ls = localStorage.getItem(item);
    if (ls) {
        return JSON.parse(ls);
    } else {
        return `${item} not found in ls`;
    }
}