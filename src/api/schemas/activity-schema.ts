import { any, number, object, string } from 'zod';

const activitySchema = object({
    // Required
    title: string({
        required_error: 'Title is required',
        invalid_type_error: 'Title should be of type string'
    }),
    description: string({
        required_error: 'Description is required',
        invalid_type_error: 'Description should be of type string'
    }),

    // Optional
    costPerIndividual: number({
        invalid_type_error: 'Cost Per Individual should be of type number'
    }).optional(),
    costPerGroup: number({
        invalid_type_error: 'Cost Per Group should be of type number'
    }).optional(),
    groupSize: number({
        invalid_type_error: 'Group size should be of type number'
    }).optional(),
    image: string({
        invalid_type_error: 'Image URL should be of type string'
    }).optional(),
    startTime: any().optional(),
    endTime: any().optional()
});

export { activitySchema };
