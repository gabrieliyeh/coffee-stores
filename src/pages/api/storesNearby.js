import { fetchCoffeeStores } from "@/lib/coffee-stores"

export default async function handler(req, res) {
  try {
    const {latLong,limit}= req.query
    const coffeeStores = await fetchCoffeeStores(latLong,limit)
    res.status(200).json(coffeeStores)
  } catch (error) {
    console.error('There is an error', error);
    res.status(500).json({message: 'oh no! Something went wrong', error})
  } 
}
