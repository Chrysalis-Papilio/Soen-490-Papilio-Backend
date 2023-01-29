import { coerce, object, string } from 'zod';
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

const costPerIndividual = coerce.number({
    required_error: requiredMessage('Cost Per Individual'),
    invalid_type_error: invalidMessage('Cost Per Individual', 'number')
});

const costPerGroup = coerce.number({
    required_error: requiredMessage('Cost Per Group'),
    invalid_type_error: invalidMessage('Cost Per Group', 'number')
});

const groupSize = coerce.number({
    required_error: requiredMessage('Group Size'),
    invalid_type_error: invalidMessage('Group Size', 'number')
});

const startTime = coerce.date({
    required_error: requiredMessage('Start Time')
});

const endTime = coerce.date({
    required_error: requiredMessage('End Time')
});

const address = string({
    required_error: requiredMessage('Address'),
    invalid_type_error: invalidMessage('Address', 'string')
});

/** Schemas */

const activitySchema = object({
    // Required
    title: title,
    description: description,
    address: address,
    startTime: startTime,

    // Optional
    costPerIndividual: costPerIndividual.optional(),
    costPerGroup: costPerGroup.optional(),
    groupSize: groupSize.optional(),
    endTime: endTime.optional()
});

const getFeeds = object({
    // Query
    query: object({
        // Optional
        page: coerce
            .number({
                invalid_type_error: invalidMessage('Page', 'number')
            })
            .gte(1, 'Page has to be greater or equal to 1')
            .optional(),
        size: coerce
            .number({
                invalid_type_error: invalidMessage('Size', 'number')
            })
            .gte(5, 'Size has to be greater or equal to 5')
            .optional()
    }).strict('Query contains invalid key')
});

export { activityId, title, description, costPerIndividual, costPerGroup, groupSize, startTime, endTime, address };
export { activitySchema, getFeeds };
