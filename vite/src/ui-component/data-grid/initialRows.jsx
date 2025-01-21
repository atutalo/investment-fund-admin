import { randomId } from '@mui/x-data-grid-generator';

export const initialRows = [
  {
    id: randomId(),
    type: 'Soft',
    category: 'Attitude',
    attribute: 'Approachable',
    detail: 'Available and patient with non-technical peers/stakeholders',
    selfRating: 'Emerging',
    mentorRating: 'Proficient'
  }
];
