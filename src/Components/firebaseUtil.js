import { addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getProductlist = async (db, collectionName, contextSetter) => {

    const productsCollection = collection(db, collectionName);

    try {
        const snapshot = await getDocs(productsCollection);

        const products = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log('Fetched Products:', products);
        contextSetter(products)

        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}


export const getTimeStamp = (date, time) => {


    // Parse the date string
    const parsedDate = new Date(date);

    // Extract hours, minutes, and seconds from the time string
    const [hours, minutes, seconds] = time.split(':');
    const [secondsValue, period] = seconds.split(' ');

    // Adjust hours based on the period (AM/PM)
    let adjustedHours = parseInt(hours, 10);
    if (period === 'PM' && adjustedHours < 12) {
        adjustedHours += 12;
    } else if (period === 'AM' && adjustedHours === 12) {
        adjustedHours = 0;
    }

    // Set the time components to the parsed date
    parsedDate.setHours(adjustedHours, parseInt(minutes, 10), parseInt(secondsValue, 10));

    // Get the timestamp in milliseconds
    const timestamp = parsedDate.getTime();
    console.log(timestamp);
    return timestamp

}

export const testFirestore = async ({ cat_id, date, time, name, quantity, unit_price,pay_mode }) => {
    const monthYear = `${month[new Date(date).getMonth() ].slice(0, 3)}-${new Date(date).getFullYear() % 2000}`;

    const collectionRef = collection(db, 'transactions');
    console.log(monthYear);
    const documentRef = doc(collectionRef, monthYear);

    try {
        // Check if the document exists
        const documentSnapshot = await getDoc(documentRef);

        if (documentSnapshot.exists()) {
            // Document exists, update it

            await setDoc(documentRef, { cat_id, date, time, name, quantity, unit_price });
        } else {

            const newCollectionRef = collection(db, "transactions", monthYear, pay_mode)
            const newDocRef = doc(newCollectionRef, getTimeStamp(date,time));
            await setDoc(newDocRef, { cat_id, date, time, name, quantity, unit_price });
            // Document doesn't exist, create it
            // await setDoc(documentRef, { cat_id, date, time, name, quantity, unit_price });
        }

        // Update your local state or any other necessary logic here

    } catch (error) {
        console.log('Error updating/creating document:', error);
    }
};

export const month = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
export const createTestDocument = async () => {
    const testCollectionRef = collection(db, 'testCollection');
    const testDocumentRef = doc(testCollectionRef, 'testDocument');

    try {
        // Create the "testDocument" if it doesn't exist
        await setDoc(testDocumentRef, {});

        // Inside "testDocument," create a collection named "credit"
        const creditCollectionRef = collection(testDocumentRef, 'credit');

        // Inside "credit," create a document named "testcreditItem" with the specified data
        const testCreditItemRef = doc(creditCollectionRef, 'testcreditItem');
        await setDoc(testCreditItemRef, { name: 'dummy', price: '5tk' });

        console.log('Document creation successful');

    } catch (error) {
        console.error('Error creating document:', error);
    }
};