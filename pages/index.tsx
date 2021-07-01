import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import firebase from "firebase/app";
import "firebase/auth";
import { FIREBASE_CONFIG } from '../config/firebase';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState(null as any);

  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (signInUser: any) => {
      setUser(signInUser)
    })
  }, []);

  const signInWithSocialNetwork = async (providerName: string) => {

    let provider;
    switch (providerName) {
      case "google":
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      case "facebook":
        provider = new firebase.auth.FacebookAuthProvider();
        break;
      default:
        throw new Error("Invalid provider");
    }

    try {
      if (provider) {
        await firebase.auth().signInWithRedirect(provider);
        await firebase.auth().getRedirectResult();

      }
    } catch (err) {
      console.log(err);
      // let message = `Some things wrong. Please try again.`;
      if (err.code === "auth/account-exists-with-different-credential") {
        let message = 'Account exists with different credential, you must link the account to other credentials.';
        throw new Error(message);
      }
    }
  }

  return (
    <>
      <h2>HELLO, {user?.displayName}</h2>
      <div className={styles.container}>
        <button onClick={async () => {
          await signInWithSocialNetwork('google')
        }} > Sign in </button>
        <button onClick={async () => {
            await firebase.auth().signOut();
        }} > Sign out </button>
      </div>
    </>
  )
}
