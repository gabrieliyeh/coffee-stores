import styles from "../../styles/coffee-store.module.css";
import cls from "classnames";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import useSWR from "swr";
import { fetchCoffeeStores } from "@/lib/coffee-stores";
import { useEffect, useState, useContext} from "react";
import { StoreContext } from "@/context/storeContext";
import { fetcher, isEmpty } from "../../utils";

export const getStaticProps = async ({ params }) => {
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.fsq_id.toString() === params.id;
  });
  return {
    props: {
      coffeeStorePropData: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
};

export const getStaticPaths = async () => {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.fsq_id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
};

const CoffeeStore = ({ coffeeStorePropData }) => {
  const [coffeeStore, setCoffeeStore] = useState(coffeeStorePropData || {});
  const { coffeeStoresData } = useContext(StoreContext);
  const router = useRouter();
  const id = router.query.id;
  const [votingCount, setVotingCount]= useState(0)

  const handleCreateCoffeeStore = async (coffeeStore) => {
      try {
          const { name, formatted_address, cross_street, imgUrl } = coffeeStore;
          const response = await fetch("/api/createCoffeeStore", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id,
              name,
              voting: 0,
              imgUrl,
              cross_street: cross_street || "",
              formatted_address: formatted_address || "",
            }),
          });
          const dbCoffeeStore = await response.json();
      } catch (err) {
        console.error("Error creating coffee store", err);
      }
    };
  const {data, error}=  useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher)
 

  useEffect(()=> {
    if(data && data.length > 0){
      setCoffeeStore(data[0])
      setVotingCount(data[0].voting)
    }     
  }, [data])


  useEffect(() => {
    if (isEmpty(coffeeStorePropData)) {
      if (coffeeStoresData.length > 0) {
        const coffeeStoreFromContext = coffeeStoresData.find(coffeeStore => {
          return coffeeStore.fsq_id.toString() === id; //dynamic id
        });
        if (coffeeStoreFromContext) {
          handleCreateCoffeeStore(coffeeStoreFromContext);
          setCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      // SSG
      handleCreateCoffeeStore(coffeeStore);
    }
    // eslint-disable-next-line
  }, [id, coffeeStoresData, coffeeStore,coffeeStorePropData]);

  const { name, formatted_address, cross_street, imgUrl } = coffeeStore;


  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleUpvoteButton = async() => {
    try {
      const response = await fetch("/api/favoriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id
        }),
      });
      const dbCoffeeStore = await response.json()
      if(dbCoffeeStore && dbCoffeeStore.length > 0){
        const count = votingCount + 1
        setVotingCount(count)
      }
   
    } catch (error) {
      console.error("Error up voting the coffee store", error);
    }
 
  };
  if(error){
    return <div>Something went wrong receiving coffee store page</div>
  }
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`} />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">← Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <div className={styles.storeImgWrapper}>
            <Image
              src={
                imgUrl ||
                "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              }
              width="600"
              height="360"
              className={styles.storeImg}
              alt="image"
            />
          </div>
        </div>
        <div className={cls("glass", styles.col2)}>
          {formatted_address && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width="24"
                height="24"
                alt="places icon"
              />
              <p className={styles.text}>{formatted_address}</p>
            </div>
          )}
          {cross_street && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{cross_street}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
