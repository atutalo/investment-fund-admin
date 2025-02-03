import {doc, addDoc, getDocs, updateDoc, deleteDoc, collection} from 'firebase/firestore';
import {db} from '../firebaseConfig';

const growthTraitRepository = {
    async getGrowthAssessmentTraits() {
        const querySnapshot = await getDocs(collection(db, 'growthAssessmentTraits'));
        return querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    },
    async updateGrowthAssessmentTrait(id, updatedData) {
        const docRef = doc(db, 'growthAssessmentTraits', id);
        await updateDoc(docRef, updatedData);
    },
    async deleteGrowthAssessmentTrait(id) {
        const docRef = doc(db, 'growthAssessmentTraits', id);
        await deleteDoc(docRef);
    },
    async addGrowthAssessmentTrait(newData) {
        const docRef = await addDoc(collection(db, 'growthAssessmentTraits'), newData);
        return { id: docRef.id, ...newData };
    }
};

export default growthTraitRepository;