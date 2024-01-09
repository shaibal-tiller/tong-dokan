import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAaI6DTK8Y1PpAufEsVOcOTKjXRp147Ii8",
    authDomain: "tong-dokan-7442a.firebaseapp.com",
    databaseURL: "https://tong-dokan-7442a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tong-dokan-7442a",
    storageBucket: "tong-dokan-7442a.appspot.com",
    messagingSenderId: "562177900648",
    appId: "1:562177900648:web:d1cdab5f18acda3d753bdd"
};
/* const firebaseConfig = {
    apiKey: "AIzaSyBwA7CE1pYAJlU5UwGT6BPChQ9x8A5CWMg",
    authDomain: "tong-dokan-2.firebaseapp.com",
    projectId: "tong-dokan-2",
    storageBucket: "tong-dokan-2.appspot.com",
    messagingSenderId: "619137752075",
    appId: "1:619137752075:web:421c069a4ecc24b1c03b0e"
}; */

const app = initializeApp(firebaseConfig,{experimentalForceLongPolling:true});
export const db = getFirestore(app);