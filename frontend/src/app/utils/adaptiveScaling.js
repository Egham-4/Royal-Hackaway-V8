const Papa = require('papaparse');

const csvData = "id,value\n1,100\n2,200\n3,300";

function parseCsv(csvData) {
  const result = Papa.parse(csvData, { header: true, skipEmptyLines: true });
  console.log(result.data);
  return result.data;
}

parseCsv(csvData);
module.exports = parseCsv;
