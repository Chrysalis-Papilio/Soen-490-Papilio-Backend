import { genreRepo } from '../repos';

const getAllGenres = async () => {
    return genreRepo.getAllGenres();
};

const addGenre = async (genre: any) => {
    return genreRepo.addGenre(genre);
};

export { getAllGenres, addGenre };
