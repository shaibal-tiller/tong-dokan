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

const app = initializeApp(firebaseConfig,{experimentalForceLongPolling:true});
export const db = getFirestore(app);