import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Banner from '@/components/Banner'
import Image from 'next/image';
import Card from '@/components/Card';
import { fetchCoffeeStores } from '@/lib/coffee-stores';
import useTrackLocation from '@/hooks/useTrackLocation';
import { useEffect, useState,useContext} from 'react';
import { ACTION_TYPES, StoreContext } from '@/context/storeContext';

export const getStaticProps = async({context})=> {
  const coffeeStores = await fetchCoffeeStores()
  return {
    props: {
      coffeeStores
    }
  }
} 

export default function Home({coffeeStores}) {
  const {handleTrackLocation, locationErrorMsg,isFindingLocation}= useTrackLocation()
  const [error, setError]= useState(null)
  const {dispatch,coffeeStoresData, latLong}= useContext(StoreContext)

  useEffect(()=> {
    const fetchStoreNearby = async()=> {
      if(latLong){
        try {
          const coffeeStores = await fetch(`/api/storesNearby?latLong=${latLong}&limit=30`)
          const data = await coffeeStores.json()
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {coffeeStoresData: data}
          })
          setError('')
        } catch (error) {
          console.error(error);
          setError(error.message)
        } 
      }
    }
    fetchStoreNearby()
  }, [latLong, dispatch])
  
  const handleOnBannerBtnClick = ()=> {
    handleTrackLocation()
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>
          Coffee Connoisseur 
        </title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="allows you to discover coffee store" />
      </Head>
      <main className={styles.main}>
        <Banner buttonText= {isFindingLocation ? 'Locating...': 'View stores nearby'}
         handleOnClick={handleOnBannerBtnClick}/>
        {locationErrorMsg && <p>Something went wrong:{locationErrorMsg} </p>}
        {error && <p>Something went wrong:{error} </p>}
        <div className={styles.heroImage}>
        <Image src='/static/hero-image.png' width={700} height={400} alt='hero' priority />
        </div>
        {coffeeStoresData.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
             <div className={styles.cardLayout}>
          {coffeeStoresData.map(store=> (
          <Card key={store.fsq_id}
          name={store.name} 
          imgUrl={store.imgUrl ||  "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
          href={`/coffee-store/${store.fsq_id
          }`}
          className={styles.card}
          />
        ))} 
        </div>
          </div>
        )}
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Lekki stores</h2>
             <div className={styles.cardLayout}>
          {coffeeStores.map(store=> (
          <Card key={store.fsq_id}
          name={store.name} 
          imgUrl={store.imgUrl ||  "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
          href={`/coffee-store/${store.fsq_id
          }`}
          className={styles.card}
          />
        ))} 
        </div>
          </div>
        )}
      </main>
    </div>
  )
}
