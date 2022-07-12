//https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function formatNameString(string) {
    let stringFirstUppercase =  string.charAt(0).toUpperCase() + string.slice(1); //to uppercase
    return stringFirstUppercase.replace(/_/g, " ")
  }

const getDataByOneType = (data) =>
{
    const dataType1 = data.map(obj => ({ ...obj, type: obj.type1 }))
    const dataType2 = data.map(obj => ({ ...obj, type: obj.type2 }))
    return dataType1.concat(dataType2).filter(d => d.type !="")
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

function varToInt(d){
    if (typeof d === 'string'){
      return +d.split(" ")[0]
    }
    if (isNaN(d)){
        return 0
    }
    else{
      return +d
    }
  }

export { getDataByOneType, summarizeGroupedData, varToInt, formatNameString }