import { any, number, object, string } from 'zod';
import { invalidMessage, requiredMessage } from './util';

/** Attributes */

const activityId = string({
    required_error: requiredMessage('Activity ID'),
    invalid_type_error: invalidMessage('Activity ID', 'string')
});

const title = string({
    required_error: requiredMessage('Title'),
    invalid_type_error: invalidMessage('Title', 'string')
});

const description = string({
    required_error: requiredMessage('Description'),
    invalid_type_error: invalidMessage('Description', 'string')
});

const costPerIndividual = number({
    required_error: requiredMessage('Cost Per Individual'),
    invalid_type_error: invalidMessage('Cost Per Individual', 'number')
});

const costPerGroup = number({
    required_error: requiredMessage('Cost Per Group'),
    invalid_type_error: invalidMessage('Cost Per Group', 'number')
});

const groupSize = number({
    required_error: requiredMessage('Group Size'),
    invalid_type_error: invalidMessage('Group Size', 'number')
});

const image = string({
    required_error: requiredMessage('Image URL'),
    invalid_type_error: invalidMessage('Image URL', 'string')
});

const startTime = any({
    required_error: requiredMessage('Start Time')
});

const endTime = any({
    required_error: requiredMessage('End Time')
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
