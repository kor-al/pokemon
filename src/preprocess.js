

const getDataByOneType = (data) =>
{
    const dataType1 = data.map(obj => ({ ...obj, type: obj.type1 }))
    const dataType2 = data.map(obj => ({ ...obj, type: obj.type2 }))
    return dataType1.concat(dataType2)
}

const summarizeGroupedData = (gData, summarizeColumns, d3sumFunc) => {
    return gData.map((g)=> {
        let groupName = g[0]
        let objects = g[1]
        let result = {name: groupName}
        summarizeColumns.forEach(column => {
            result[column] = d3sumFunc(objects, d=>d[column])
        });
        return result
    })
}
export { getDataByOneType, summarizeGroupedData }