import '../styles/globals.css'
import {UserProvider} from '../contexts/userContext'

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
    
  )
}

export default MyApp
