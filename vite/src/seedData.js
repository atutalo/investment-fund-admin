import { config } from 'dotenv';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { initialRows } from './growthAssessmentChartData.js'; // Import the seed data

// Load environment variables from .env file
config();

// Import the initialized Firebase app after loading environment variables
import { db } from './firebaseConfig.js';

const createCollectionAndSeedData = async () => {
    const collectionRef = collection(db, 'growthAssessmentTraits');
    try {
        for (const data of initialRows) {
            const docRef = await addDoc(collectionRef, data);
            const docWithId = { ...data, id: docRef.id };
            await updateDoc(doc(db, 'growthAssessmentTraits', docRef.id), docWithId);
        }
        console.log('Data successfully written to Firestore!');
    } catch (error) {
        console.error('Error writing document: ', error);
    }
};

createCollectionAndSeedData().then(() => {
    console.log('Data seeding complete');
});