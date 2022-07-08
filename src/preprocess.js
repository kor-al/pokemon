const getDataByOneType = (data) =>
{
    const dataType1 = data.map(obj => ({ ...obj, type: obj.type1 }))
    const dataType2 = data.map(obj => ({ ...obj, type: obj.type2 }))
    return dataType1.concat(dataType2)
}


export default getDataByOneType;