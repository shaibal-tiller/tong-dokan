import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
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

    const date_part = new Date(date).toDateString()

    const time_part = time

    return `${date_part} ${time_part}`

}
export const getTimeStampFromObject = (date) => {
    const date_part = date.toDateString()
    const time_part = date.toTimeString().split('GMT')[0].trim()
    return `${date_part} ${time_part}`

}

export const firestoreUpload = async ({ cat_id, date, time, product_name, quantity, unit_price, pay_mode, previous_due }) => {

    const monthYear = `${month[new Date(date).getMonth()]?.slice(0, 3)}-${new Date(date).getFullYear() % 2000}`;

    try {
        const rootdocref = doc(db, 'transactions', monthYear)

        const newCollectionref = collection(rootdocref, pay_mode)

        const newdocref = doc(newCollectionref, `${getTimeStamp(date, time)}`)

        await setDoc(newdocref, { cat_id, date, time, product_name, quantity, unit_price, pay_mode, previous_due })



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
    const yearIndex = date.split('/')[date.split('/').length - 1]?.slice(2, 4)
    const documentName = `${month[monthIndex]?.slice(0, 3)}-${yearIndex}`

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
        await setDoc(expensesDocRef, {
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
        await setDoc(paidDocRef, {
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

        setter(expenseAmount - paidAmount);
    } catch (error) {
        console.log('Error fetching data:', error);
    }

}

export const initializeMonthData = async (date, setter) => {

    const monthIndex = date.getMonth()

    const yearIndex = `${date.getFullYear()}`.slice(2, 4)
    const documentName = `${month[monthIndex]?.slice(0, 3)}-${yearIndex}`


    try {
        const transactionDocRef = doc(db, 'transactions', documentName);
        const creditCollectionRef = collection(transactionDocRef, 'credit');
        const cashCollectionRef = collection(transactionDocRef, 'cash');

        const creditQuerySnapshot = await getDocs(creditCollectionRef);
        const cashQuerySnapshot = await getDocs(cashCollectionRef);
        const data = {}

        data.credit = creditQuerySnapshot.docs.map((doc) => {
            return { doc_id: doc.id, ...doc.data(), }
        });
        data.cash = cashQuerySnapshot.docs.map((doc) => {
            return { doc_id: doc.id, ...doc.data(), }
        });
        setter(data)
    } catch (error) {
        console.error(`Error fetching data from "credit" collection in ${documentName}:`, error);
    }

}

export const getDataByDay = async () => {
    try {
        // Calculate the start and end dates for the previous 5 days
        const currentDate = new Date();
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 4);

        // Query the "transactions" collection for the specified date range
        const transactionsCollectionRef = collection(db, 'transactions');
        const transactionsQuery = query(
            transactionsCollectionRef,
            where('date', '>=', startDate.toISOString()),
            where('date', '<', endDate.toISOString()),
            orderBy('date')
        );

        const transactionsSnapshot = await getDocs(transactionsQuery);
        const transactionsData = [];

        transactionsSnapshot.forEach((doc) => {
            const data = doc.data();
            transactionsData.push({ ...data, collection: 'transactions' });
        });

        // Query the "credit" collection for the specified date range
        const creditCollectionRef = collection(db, 'credit');
        const creditQuery = query(
            creditCollectionRef,
            where('date', '>=', startDate.toISOString()),
            where('date', '<', endDate.toISOString()),
            orderBy('date')
        );

        const creditSnapshot = await getDocs(creditQuery);
        const creditData = [];

        creditSnapshot.forEach((doc) => {
            const data = doc.data();
            creditData.push({ ...data, collection: 'credit' });
        });

        // Combine and organize the data by day
        const allData = [...transactionsData, ...creditData];

        const dataByDay = {};

        allData.forEach((item) => {
            const day = item.date; // Replace with the actual date property from your data
            if (!dataByDay[day]) {
                dataByDay[day] = [];
            }
            dataByDay[day].push(item);
        });



        // Update your local state or any other necessary logic here

    } catch (error) {
        console.log('Error retrieving data:', error);
    }
};

export const getValuesFromDocument = async (documentName = 'Feb-24') => {

    const creditCollectionRef = collection(db, `transactions/${documentName}/credit`);
    const cashCollectionRef = collection(db, `transactions/${documentName}/cash`);

    const creditSnapshot = await getDocs(creditCollectionRef);

    const cashSnapshot = await getDocs(cashCollectionRef);

    const values = [];

    creditSnapshot.forEach((doc) => {

        const data = doc.data();
        values.push(data); // Assuming 'value' is the field you want to extract
    });

    cashSnapshot.forEach((doc) => {
        const data = doc.data();
        values.push(data); // Assuming 'value' is the field you want to extract
    });
    return values

};
export const parseAndManipulateData = async () => {

    try {
        const productListColection = collection(db, 'productList')
        const querySnapshot = await getDocs(productListColection);
        const organizedData = {};

        querySnapshot.forEach(doc => {

            const data = doc.data();
            const { cat_id, /* other properties you need */ } = data;

            // Check if the cat_id exists as a key in the organizedData object
            if (!organizedData[cat_id]) {
                // If it doesn't exist, create an empty array for that cat_id
                organizedData[cat_id] = [];
            }
            const id = `${cat_id}${organizedData[cat_id].length + 1}`;
            const newItem = {
                id,
                ...data
                // other properties here
            };
            // Push the current document data to the array corresponding to its cat_id
            organizedData[cat_id].push(newItem);
        });

        // Now, organizedData object contains the parsed and manipulated data
        console.log(organizedData);

        // You can return the organized data if needed
        return organizedData;
    } catch (error) {
        console.log('Error parsing and manipulating data:', error);
        // Handle error appropriately
        return null;
    }
};
function getMonthNumber(monthString) {

    const months = ['Jan', 'Feb', 'Mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'Dec'];

    return months.indexOf(monthString);
}
export const fetchDataByMonthAndYear = async (month, year) => {
    // Construct the query

    const q = query(collection(db, 'payments'),
        where('date', '>=', new Date('2024', getMonthNumber(month), 1)),
        where('date', '<', new Date('2024', getMonthNumber(month) + 1, 1)));

    try {

        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.empty);
        querySnapshot.forEach((doc) => {
            // Process each document here
            console.log(doc.id, ' => ', doc.data());
        });
    } catch (e) {
        console.log('Error fetching documents: ', e);
    }
}