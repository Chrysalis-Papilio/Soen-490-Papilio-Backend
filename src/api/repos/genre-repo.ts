import { Genre } from '../models';
import { createNewObjectCaughtError } from './error';

/** Get all genres from table Genre */
const getAllGenres = async (option?: string) => {
    await Genre.sync();
    return !option ? Genre.findAll() : Genre.findAll({ where: { category: option } });
};

/** Add a new genre to the DB */
const addGenre = async (genre: Genre) => {
    await Genre.sync();
    const newGenre = await Genre.create({
        name: genre.name,
        url: genre.url || null,
        category: genre.category
    }).catch((err) => createNewObjectCaughtError(err, 'addGenre', 'There has been an error in adding a new Genre'));
    return {
        success: !!newGenre
    };
};

export { getAllGenres, addGenre };
