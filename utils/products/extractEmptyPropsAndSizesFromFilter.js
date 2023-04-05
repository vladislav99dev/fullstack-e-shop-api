const extractEmptyPropsAndSizesFromFilter = (data) => {
    const sizes = [...data.sizes];
    for (const prop in data) {
        if(data[prop] === '' || Array.isArray(data[prop])) delete data[prop];
    }
    return {filterData:data,filterSizes:sizes}
}
module.exports = extractEmptyPropsAndSizesFromFilter;