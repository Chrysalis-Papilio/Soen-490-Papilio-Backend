import { boolean, number, object, string } from 'zod';
import { requiredMessage, invalidMessage } from './util';
import { activitySchema } from './activity-schema';

/** Attributes */

const firebase_id = string({
    required_error: requiredMessage('Firebase ID'),
    invalid_type_error: invalidMessage('Firebase ID', 'string')
});

const firstName = string({
    required_error: requiredMessage('First Name'),
    invalid_type_error: invalidMessage('First Name', 'string')
}).min(2, 'First Name too short!');

const lastName = string({
    required_error: requiredMessage('Last Name'),
    invalid_type_error: invalidMessage('Last Name', 'string')
}).min(2, 'Last name too short!');

const email = string({
    required_error: requiredMessage('Email'),
    invalid_type_error: invalidMessage('Email', 'string')
}).email('Invalid email');

const phone = string({
    required_error: requiredMessage('Phone'),
    invalid_type_error: invalidMessage('Phone', 'string')
}).regex(new RegExp('^\\d{10}$'), 'Invalid phone number (10 digits)');

const countryCode = string({
    required_error: requiredMessage('Country Code'),
    invalid_type_error: invalidMessage('Country Code', 'string')
}).regex(new RegExp('^([0-9]|[1-9][0-9]|[1-9][0-9][0-9])$'), 'Invalid country code (0-999)');

const bio = string({
    required_error: requiredMessage('Bio'),
    invalid_type_error: invalidMessage('Bio', 'string')
});

const favoriteActivities = number({
    required_error: requiredMessage('favoriteActivities'),
    invalid_type_error: invalidMessage('favoriteActivities', 'number')
});

const indoor = boolean({
    required_error: requiredMessage('Indoor'),
    invalid_type_error: invalidMessage('Indoor', 'boolean')
});

const outdoor = boolean({
    required_error: requiredMessage('Outdoor'),
    invalid_type_error: invalidMessage('Outdoor', 'boolean')
});

const genres = number({
    required_error: requiredMessage('Genre List'),
    invalid_type_error: invalidMessage('Genre List', 'number[]')
}).array();

/** Schemas */

const userSchema = object({
    //  Required
    firebase_id: firebase_id,
    firstName: firstName,
    lastName: lastName,
    email: email,

    //  Optional
    phone: phone.optional(),
    countryCode: countryCode.optional(),
    bio: bio.optional(),
    favoriteActivities: favoriteActivities.optional()
});

const createUserSchema = object({
    body: object({
        user: userSchema.strict('Request contains an invalid key')
    })
});

const quizSchema = object({
    indoor: indoor,
    outdoor: outdoor,
    genres: genres
});

const getAllUsers = object({});

const getUserByEmailSchema = object({
    params: object({
        //  Required
        email: email
    }).strict('Request contains an invalid key')
});

const getUserById = object({
    params: object({
        // Required
        id: firebase_id
    }).strict('Request contains an invalid key')
});

const getUserActivityList = getUserById;

const userAddFavoriteActivitySchema = object({
    body: object({
        //  Identifier attribute
        identifier: object({
            firebase_id: firebase_id
        }).strict('Identifier field contains an invalid key'),

        //  Update attribute
        update: object({
            favoriteActivities: favoriteActivities
        }).strict('Update field contains an invalid key')
    })
});

const updateUserSchema = object({
    body: object({
        //  Identifier attribute
        identifier: object({
            firebase_id: firebase_id
        }).strict('Identifier field contains an invalid key'),

        //  Update attribute
        update: object({
            firstName: firstName.optional(),
            lastName: lastName.optional(),
            email: email.optional(),
            phone: phone.optional(),
            countryCode: countryCode.optional(),
            bio: bio.optional(),
            favoriteActivities: favoriteActivities.optional()
        })
            .strict('Update field contains an invalid key')
            .refine(
                ({ firstName, lastName, email, phone, countryCode, bio }) =>
                    firstName !== undefined ||
                    lastName !== undefined ||
                    email !== undefined ||
                    phone !== undefined ||
                    countryCode !== undefined ||
                    bio !== undefined ||
                    favoriteActivities !== undefined,
                { message: 'One of the fields must be defined' }
            )
    })
});

const addNewUserActivity = object({
    params: object({
        id: firebase_id
    }).strict('Request URL contains an invalid key'),
    body: object({
        activity: activitySchema.strict('Activity field contains an invalid key')
    })
});

const submitQuiz = object({
    params: object({
        id: firebase_id
    }).strict('Request URL contains an invalid key'),
    body: quizSchema.strict('Quiz field contains an invalid key')
});

const getChatUserToken = object({
    params: object({
        // Required
        id: firebase_id
    }).strict('Request contains an invalid key')
});

export { firebase_id, firstName, lastName, email, phone, countryCode };
export { userSchema, createUserSchema, getAllUsers, getUserByEmailSchema, getUserById, getUserActivityList, updateUserSchema, userAddFavoriteActivitySchema, addNewUserActivity, submitQuiz, getChatUserToken };
