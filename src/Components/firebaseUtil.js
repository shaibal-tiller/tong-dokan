import { addDoc, collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getProductlist = async (db, collectionName, contextSetter) => {

    const productsCollection = collection(db, collectionName);

    try {
        const snapshot = await getDocs(productsCollection);

        const products = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
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

export const firestoreUpload = async ({ cat_id, date, time, product_name, quantity, unit_price, pay_mode }) => {
    console.log({ cat_id, date, time, product_name, quantity, unit_price, pay_mode });
    const monthYear = `${month[new Date(date).getMonth()].slice(0, 3)}-${new Date(date).getFullYear() % 2000}`;
    // console.log({ cat_id, date, time, product_name, quantity, unit_price, pay_mode });
    try {
        const rootdocref = doc(db, 'transactions', monthYear)

        const newCollectionref = collection(rootdocref, pay_mode)
        console.log(pay_mode);
        const newdocref = doc(newCollectionref, `${getTimeStamp(date, time)}`)

        await setDoc(newdocref, { cat_id, date, time, product_name, quantity, unit_price, pay_mode })



    } catch (error) {
        console.log('Error updating/creating document:', error);
    }
};

export const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const getMonthIndex = (month_num) => {
    return month_num == 11 ? 0 : month_num
}
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


export const getMonthDetails = async (date, setter) => {
    const monthIndex = date.split('/')[0] - 1
    const yearIndex = date.split('/')[date.split('/').length - 1].slice(2, 4)
    const documentName = `${month[monthIndex].slice(0, 3)}-${yearIndex}`
    console.log(documentName);
    try {
        const transactionDocRef = doc(db, 'transactions', documentName);
        const creditCollectionRef = collection(transactionDocRef, 'credit');
        const cashCollectionRef = collection(transactionDocRef, 'cash');

        const creditQuerySnapshot = await getDocs(creditCollectionRef);
        const cashQuerySnapshot = await getDocs(cashCollectionRef);
        const data = {}
        data.credit = creditQuerySnapshot.docs.map((doc) => {
            return doc.data()
        });
        data.cash = cashQuerySnapshot.docs.map((doc) => {
            return doc.data()
        });

        setter(data)
    } catch (error) {
        console.error(`Error fetching data from "credit" collection in ${documentName}:`, error);
    }
}

export const updateCredit = async (amount) => {
    let expenses = 0

    const date = new Date().toISOString()

    try {
        const expensesDocRef = doc(db, 'balance', 'expense')
        const expensesSnapshot = await getDoc(expensesDocRef);

        if (expensesSnapshot.exists()) {
            expenses = expensesSnapshot.data().amount
        }
        await updateDoc(expensesDocRef, {
            amount: expenses + amount,
            last_update_time: date,
        });
    } catch (error) {
        console.log(error);

    }


}
export const updateCash = async (amount, syncCredit = false) => {
    let paid = 0
    const date = new Date().toISOString()
    try {
        const paidDocRef = doc(db, 'balance', 'paid')

        const paidSnapshot = await getDoc(paidDocRef);
        if (paidSnapshot.exists()) {
            paid = paidSnapshot.data().amount

        }
        await updateDoc(paidDocRef, {
            amount: paid + amount,
            last_update_time: date,
        });
        syncCredit && updateCredit(amount)
    } catch (error) {
        console.log(error);

    }


}

export const syncBalanceAmount = async ({ credit, cash }) => {
    let expenses = 0
    let paid = 0

    try {
        const expensesDocRef = (credit && credit > 0) ? doc(db, 'balance', 'expense') : null
        const paidDocRef = (cash && cash > 0) ? doc(db, 'balance', 'paid') : null
        if (expensesDocRef) {
            const expensesSnapshot = await getDoc(expensesDocRef);

            if (expensesSnapshot.exists()) {
                expenses = expensesSnapshot.data().amount
            }
            await updateDoc(expensesDocRef, {
                amount: expenses + credit,
            });



        }

        if (paidDocRef) {
            const paidSnapshot = await getDoc(paidDocRef);
            if (paidSnapshot.exists()) {
                paid = paidSnapshot.data().amount
            }
            await updateDoc(paidDocRef, {
                amount: paid + cash,
            });
        }
    } catch (error) {
        console.log(error);
    }
}

export const initializeBalance = async (setter) => {
    try {
        // Access the Firestore database


        // Get the "balance" collection
        const balanceCollection = collection(db, 'balance');

        // Get the "expense" document
        const expenseDoc = await getDoc(doc(balanceCollection, 'expense'));
       
        const expenseAmount = expenseDoc.data()?.amount || 0;
        // Get the "paid" documentECB Chattar, Dhaka
        const paidDoc = await getDoc(doc(balanceCollection, 'paid'));
        const paidAmount = paidDoc.data()?.amount || 0;

        // Update the state with the fetched data
        console.log(expenseAmount);
        setter(expenseAmount - paidAmount);
    } catch (error) {
        console.log('Error fetching data:', error);
    }

}

export const initializeMonthData =async (date,setter) => {

    const monthIndex = date.split('/')[0] - 1
    const yearIndex = date.split('/')[date.split('/').length - 1].slice(2, 4)
    const documentName = `${month[monthIndex].slice(0, 3)}-${yearIndex}`
    
    try {
        const transactionDocRef = doc(db, 'transactions', documentName);
        const creditCollectionRef = collection(transactionDocRef, 'credit');
        const cashCollectionRef = collection(transactionDocRef, 'cash');

        const creditQuerySnapshot = await getDocs(creditCollectionRef);
        const cashQuerySnapshot = await getDocs(cashCollectionRef);
        const data = {}
        data.credit = creditQuerySnapshot.docs.map((doc) => {
            return doc.data()
        });
        data.cash = cashQuerySnapshot.docs.map((doc) => {
            return doc.data()
        });
        setter(data)
    } catch (error) {
        console.error(`Error fetching data from "credit" collection in ${documentName}:`, error);
    }

}