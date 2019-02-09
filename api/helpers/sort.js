module.exports = function sort(arrayToSort, args) {
    if (args.direction === "ASC") {
        arrayToSort.sort((a, b) => a[args.field].localeCompare(b[args.field]));
    }
    else if (args.direction === "DESC") {
        arrayToSort.sort((a, b) => b[args.field].localeCompare(a[args.field]));
    }
};
