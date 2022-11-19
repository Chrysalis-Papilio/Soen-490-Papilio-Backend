import { any, number, object, string } from 'zod';

/** Attributes */

const activityId = string({
    required_error: 'Activity ID is required',
    invalid_type_error: 'Activity ID should be of type string'
});

const title = string({
    required_error: 'Title is required',
    invalid_type_error: 'Title should be of type string'
});

const description = string({
    required_error: 'Description is required',
    invalid_type_error: 'Description should be of type string'
});

const costPerIndividual = number({
    required_error: 'Cost Per Individual is required',
    invalid_type_error: 'Cost Per Individual should be of type number'
});

const costPerGroup = number({
    required_error: 'Cost Per Group is required',
    invalid_type_error: 'Cost Per Group should be of type number'
});

const groupSize = number({
    required_error: 'Group Size is required',
    invalid_type_error: 'Group size should be of type number'
});

const image = string({
    required_error: 'Image URL is required',
    invalid_type_error: 'Image URL should be of type string'
});

const startTime = any({
    required_error: 'Start Time is required'
});

const endTime = any({
    required_error: 'End Time is required'
});

/** Schemas */

const activitySchema = object({
    // Required
    title: title,
    description: description,

    // Optional
    costPerIndividual: costPerIndividual.optional(),
    costPerGroup: costPerGroup.optional(),
    groupSize: groupSize.optional(),
    image: image.optional(),
    startTime: startTime.optional(),
    endTime: endTime.optional()
});

export { activityId, title, description, costPerIndividual, costPerGroup, groupSize, image, startTime, endTime };
export { activitySchema };
