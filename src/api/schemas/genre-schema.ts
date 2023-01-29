import { string, object } from 'zod';
import { invalidMessage, requiredMessage } from './util';

/** Attributes */

const name = string({
    required_error: requiredMessage('Name'),
    invalid_type_error: invalidMessage('Name', 'string')
});

const url = string({
    required_error: requiredMessage('Image URL'),
    invalid_type_error: invalidMessage('Image URL', 'string')
});

const category = string({
    required_error: requiredMessage('Genre Category'),
    invalid_type_error: invalidMessage('Genre Category', 'string')
});

/** Schemas */

const genreSchema = object({
    // Required
    name: name,
    category: category,

    // Optional
    url: url.optional()
});

const getAllGenres = object({});

const addGenre = object({
    body: object({
        genre: genreSchema.strict('Genre field contains an invalid key')
    })
});

export { name, url, category };
export { genreSchema, getAllGenres, addGenre };
