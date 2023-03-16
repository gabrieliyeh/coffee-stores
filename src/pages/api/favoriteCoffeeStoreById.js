const { findCoffeeStoreByFilter, table } = require("@/lib/airtable")

const favoriteCoffeeStoreById = async (req, res) => {
  try {
    if(req.method === "PUT"){
      const {id} = req.body
      if(id){
        const records = await findCoffeeStoreByFilter(id) 
        if(records.length !== 0){
          const record = records[0]
          const calculateVoting = parseInt(record.voting) + 1
          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: parseInt(calculateVoting) 
              }
            }
          ])
          if(updateRecord){
            res.status(200).json(updateRecord)
          }
      }else{
        res.json({message: 'coffee store id does not exist', id})
      }
    }else {
      res.status(400).json({message: 'no id was provided'})
    }
  }else {
    res.status(405).send({message: 'method not allowed'})
  }
 }catch (error) {
    console.error({message: 'Error up voting coffee store'},error)
    res.json({message: 'Error up voting coffee store', error})
  }

}

export default favoriteCoffeeStoreById

