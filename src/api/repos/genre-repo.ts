import { Genre } from '../models';
import { createNewObjectCaughtError } from './error';

/** Get all genres from table Genre */
const getAllGenres = async () => {
    await Genre.sync({ alter: true });
    return Genre.findAll();
};

/** Add a new genre to the DB */
const addGenre = async (genre: Genre) => {
    await Genre.sync({ alter: true });
    const newGenre = await Genre.create({
        name: genre.name,
        url: genre.url || null
    }).catch((err) => createNewObjectCaughtError(err, 'addGenre', 'There has been an error in adding a new Genre'));
    return {
        success: !!newGenre
    };
};

export { getAllGenres, addGenre };
