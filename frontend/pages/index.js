import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.contactList}></div>
      <div className={styles.chat}>
        <div className={styles.chatInput}>
          <input placeholder='mention your problem'></input>
        </div>
      </div>
    </div>
  )
}
