import { findCoffeeStoreByFilter, getMinifiedRecords, table } from '@/lib/airtable';

const {AIRTABLE_API_KEY,AIRTABLE_BASE_KEY} = process.env

const Airtable = require('airtable');
const base = new Airtable({apiKey: AIRTABLE_API_KEY}).base(AIRTABLE_BASE_KEY);


export default async function createCoffeeStore(req, res) {
  if(req.method !== 'POST'){
    res.json({message: 'method is GET'})
    return
  }
  const { id , name, formatted_address, cross_street, imgUrl, voting } = req.body 
  
  try{
    if(id){ 
      const records = await findCoffeeStoreByFilter(id) 
      if(records.length !== 0){
         res.status(200).json(records)
       }else{
         if(name){
           const createRecords = await table.create([
             {
               fields: {
                 id,
                 name,
                 formatted_address,
                 cross_street,
                 imgUrl,
                 voting 
               }
             }
           ])
           const records = getMinifiedRecords(createRecords)
           res.status(200).json(records)
         } else {
           res.status(400).json({message: 'Id or name is missing'})
         } 
       }   
    }else {
      res.status(400).json({message: 'Id is missing'})
    }  
  
}catch(err){
  console.error('Error creating or finding a store', err)
  res.status(500).json({message: 'Error creating or finding a store', err})
}
}

