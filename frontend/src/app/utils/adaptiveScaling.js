// CommonJS syntax.

// Import these modules.

// Import the papaparse module.
const Papa = require('papaparse');
// Import the File Server module.
const fs = require('fs');
const path = require('path');



function parseCsv(csvData) {
  const result = Papa.parse(csvData, {header:true, skipEmptyLines:false});
  console.log(result.data);
  return result.data;
}


module.exports = parseCsv;

// Testing with csv files.

// Read the csv file.
const file_path = path.join(__dirname, 'revenue_data.csv');
const csvData = fs.readFileSync(file_path, 'utf8');

// Parse csvData.
console.log('Parsing with skipEmptyLines: false');
//parseCsv(csvData, false);

// Test with 110 rows.
const hotelPath = path.join(__dirname, 'cleaned_hotel_book.csv');
const hotelCsv = fs.readFileSync(hotelPath, 'utf8');

console.log('Parsing with skipEmptyLines: false');
//parseCsv(hotelCsv, false);

// Test with 4551 rows.
const cafePath = path.join(__dirname, 'cleaned_cafe_sales.csv');
const cafeCsv = fs.readFileSync(cafePath, 'utf8');
parseCsv(cafeCsv, false);
console.log('Parsing with skipEmptyLines: false');