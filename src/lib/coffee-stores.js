import { createApi } from 'unsplash-js';

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const {NEXT_PUBLIC_FOURSQUARE_API_KEY}= process.env
const getUrl = (latLong,query,limit)=> {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`
}

export const getListOfCoffeeStorePhotos = async ()=> {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee shop',
    perPage: 30,
  });
  const unsplashResults = photos.response?.results
 return unsplashResults?.map(result => result.urls['small'])
}

export const fetchCoffeeStores = async (latLong='6.45,3.43', limit = 6) => {
   
  const photos = await getListOfCoffeeStorePhotos()
  const response = await fetch(getUrl(latLong,'coffee',  limit), {
    headers: {
      'Accept': 'application/json',
      'Authorization': `${NEXT_PUBLIC_FOURSQUARE_API_KEY}`,
    }
  })
  const data = await response.json()

  return data.results?.map((result, i) => {
    return {
      fsq_id: result.fsq_id,
      formatted_address: result.location.formatted_address || '',
      name: result.name,
      cross_street: result.location.cross_street || '',
      imgUrl:photos[i]
    }
  }) 
}