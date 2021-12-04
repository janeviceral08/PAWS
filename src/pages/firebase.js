import * as firebase from "firebase";
import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
    apiKey: "AIzaSyD189wObA1O0Zn69yzO9mmj0q7gVtRZc4A",
    authDomain: "capstone2021-94760.firebaseapp.com",
    databaseURL: "https://capstone2021-94760-default-rtdb.firebaseio.com",
    projectId: "capstone2021-94760",
    storageBucket: "capstone2021-94760.appspot.com",
    messagingSenderId: "949556606795",
    appId: "1:949556606795:web:692fb7ec863ac378fc5ace"
};
firebase.initializeApp(config);

export default firebase;