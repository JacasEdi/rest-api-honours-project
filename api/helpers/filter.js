module.exports = async function filter(modelToFilter, args) {
    let filteredArray = [];

    if (args.operator === "EQUALS") {
        filteredArray = await modelToFilter.find({ [args.field]:[args.value] });
    }
    else if (args.operator === "CONTAINS") {
        filteredArray = await modelToFilter.find({ [args.field]:{$regex:[args.value], $options: "i"} });
    }

    return filteredArray;
}
