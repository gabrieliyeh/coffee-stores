import '@/styles/globals.css'
import { StoreProvider } from '@/context/storeContext'

export default function App({ Component, pageProps }) {
  return( 
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  )
}
