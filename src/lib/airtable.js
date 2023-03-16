const {AIRTABLE_API_KEY,AIRTABLE_BASE_KEY} = process.env

const Airtable = require('airtable');
const base = new Airtable({apiKey: AIRTABLE_API_KEY}).base(AIRTABLE_BASE_KEY);

const table = base('coffee-stores');

const getMinifiedRecord= (record)=> {
  return {
    recordId: record.id,
    ...record.fields
  }
}
const getMinifiedRecords = (records)=> {
  return records.map(record => getMinifiedRecord(record))
}

const findCoffeeStoreByFilter = async (id)=> {
  const findCoffeeStoreRecords = await table.select({
    filterByFormula:`id="${id}"`
  }).firstPage(); 
    return getMinifiedRecords(findCoffeeStoreRecords)
}

export {table, getMinifiedRecords, findCoffeeStoreByFilter}