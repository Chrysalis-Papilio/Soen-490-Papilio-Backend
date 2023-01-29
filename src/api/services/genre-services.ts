import { genreRepo } from '../repos';

const getAllGenres = async (option?: string) => {
    return genreRepo.getAllGenres(option);
};

const addGenre = async (genre: any) => {
    return genreRepo.addGenre(genre);
};

export { getAllGenres, addGenre };
