import growthTraitRepository from '../repositories/growthTraitRepository.js';

const getGrowthAssessmentTraits = async () => {
    try {
        return await growthTraitRepository.getGrowthAssessmentTraits();
    } catch (error) {
        console.error('Error fetching growth assessment traits:', error);
        throw error;
    }
};

const updateGrowthAssessmentTrait = async (id, updatedData) => {
    try {
        const { selfRating, mentorRating, ...dataToUpdate } = updatedData; // Exclude selfRating and mentorRating
        await growthTraitRepository.updateGrowthAssessmentTrait(id, dataToUpdate);
    } catch (error) {
        console.error('Error updating growth assessment trait:', error);
        throw error;
    }
};

const deleteGrowthAssessmentTrait = async (id) => {
    try {
        await growthTraitRepository.deleteGrowthAssessmentTrait(id);
    } catch (error) {
        console.error('Error deleting growth assessment trait:', error);
        throw error;
    }
};

const addGrowthAssessmentTrait = async (newData) => {
    try {
        return await growthTraitRepository.addGrowthAssessmentTrait(newData);
    } catch (error) {
        console.error('Error adding growth assessment trait:', error);
        throw error;
    }
};

export default {
    getGrowthAssessmentTraits,
    updateGrowthAssessmentTrait,
    deleteGrowthAssessmentTrait,
    addGrowthAssessmentTrait
};