// Import the functions you need from the SDKs you need
import {initializeApp, getApp, getApps} from 'firebase/app';
import { getDatabase }  from 'firebase/database';
import {getAuth} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFUJfPu7BOiQ64sOnvncrXd5ELf-QgkJ0",
  authDomain: "testing-d7f0d.firebaseapp.com",
  projectId: "testing-d7f0d",
  storageBucket: "testing-d7f0d.appspot.com",
  messagingSenderId: "465969891949",
  appId: "1:465969891949:web:baf8e79dab37bf8d0c4d64"
};
 
// Initialize Firebase
// const app = initializeApp(firebaseConfig);

var app;
if (!getApps().length){
  app = initializeApp(firebaseConfig); // If no app exists.
}
else{
  const APPS = getApps();
  app = APPS[0]; // Choose the first app from the array.
}

export const db = getDatabase(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Import the functions you need from the SDKs you need
// import {initializeApp, getApp, getApps} from 'firebase/app';
// import { getDatabase }  from 'firebase/database';
// import {getAuth} from 'firebase/auth'
// import { getFirestore } from 'firebase/firestore';

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBct2sk3uH7fNq8TN-S-2EmaNTf8wBj-Ts",
//   authDomain: "lab05-72682.firebaseapp.com",
//   projectId: "lab05-72682",
//   storageBucket: "lab05-72682.appspot.com",
//   messagingSenderId: "293913227118",
//   appId: "1:293913227118:web:53a4e22dc0c45bbce25b7f"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const FIREBASE_APP = initializeApp(firebaseConfig);
// export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
// export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
// export const FIREBASE_DB = getDatabase(FIREBASE_APP);
