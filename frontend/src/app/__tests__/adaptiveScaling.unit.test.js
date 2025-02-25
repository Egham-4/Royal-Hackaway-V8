// __tests__/adaptiveScaling.test.js
const parseCsv = require('../utils/adaptiveScaling'); 


describe('parseCsv function', () => {
  it('should correctly parse CSV data', () => {
    const csvData = "id,value\n1,100\n2,200\n3,300";
    
    const result = parseCsv(csvData);
    
    expect(result).toEqual([
      { id: '1', value: '100' },
      { id: '2', value: '200' },
      { id: '3', value: '300' }
    ]);
  });

  it('should return an empty array for empty CSV', () => {
    const csvData = "";
    
    const result = parseCsv(csvData);
    
    expect(result).toEqual([]);
  });

  it('should correctly handle CSV with missing values', () => {
    const csvData = "id,value\n1,100\n2,";
    
    const result = parseCsv(csvData);
    
    expect(result).toEqual([
      { id: '1', value: '100' },
      { id: '2', value: '' }
    ]);
  });
});
