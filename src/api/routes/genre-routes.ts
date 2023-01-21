import express from 'express';
import { validate } from '../middlewares/validateResource';
import { genreController } from '../controllers';
import * as genreSchema from '../schemas/genre-schema';

const router = express.Router();

/** GET */

router.get('/genre/all', validate(genreSchema.getAllGenres), genreController.getAllGenres);

/** POST */

router.post('/genre/add', validate(genreSchema.addGenre), genreController.addGenre);

export = router;
