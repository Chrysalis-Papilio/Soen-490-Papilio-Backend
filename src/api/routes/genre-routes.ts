import express from 'express';
// import {validate} from "../middlewares/validateResource";
import { genreController } from '../controllers';

const router = express.Router();

/** GET */

router.get('/genre/all', genreController.getAllGenres);

/** POST */

router.post('/genre/add', genreController.addGenre);

export = router;
