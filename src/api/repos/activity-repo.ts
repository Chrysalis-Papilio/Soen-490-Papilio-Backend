import { Activity } from '../models';
import { BaseError } from '../../errors/base-error';
import { httpStatusCode } from '../../types/httpStatusCodes';
import sequelize from '../../config/sequelize';
import { queryResultError } from './error';

/** Get all available Activities with pagination */
const getAllActivities = async (page: number, size: number) => {
    await Activity.sync();
    const result = await Activity.findAndCountAll({
        limit: size,
        offset: (page - 1) * size
    });
    return {
        ...result,
        totalPages: Math.ceil(result.count / size),
        currentPage: page
    };
};

/** Get details of a particular Activity using 'id' */
const getActivity = async (id: number) => {
    await Activity.sync();
    const activity = await Activity.findByPk(id);
    return {
        found: !!activity,
        activity: activity
    };
};

/** Update details of the Activity */
const updateActivity = async (id: number, update: any) => {
    await Activity.sync();
    const result = await Activity.update(update, {
        where: { id },
        returning: true
    }).catch((err) => {
        console.log(err);
        throw new BaseError('ORM Sequelize Error', 'There has been an error in updating the Activity', 'updateActivity', httpStatusCode.INTERNAL_SERVER, true);
    });
    return {
        success: !!result,
        activity: result[1][0]
    };
};

/** Search for Activities using the provided 'keyword' */
const searchActivities = async (keyword: string) => {
    // Repack the keyword string to be usable in pgsql to_tsquery()
    // And we don't want to use phraseto_tsquery() because we don't need to match the order of words
    const keywordListRepacked = keyword
        .split(' ')
        .filter((item) => {
            return item.trim().length > 1; // Remove meaningless empty or 1-letter words
        })
        .join(' & ');

    const MAX_SEARCH_RESULT = 30;
    const queryString =
        // QUERY TO SEARCH FOR ACTIVITIES USING FULL-TEXT SEARCH
        `SELECT A."id", "title", "description", "images"[1]
         FROM "Activities_Tokens_Search" ATS,
              "Activities" A
         WHERE 
           ATS."tokens" @@ to_tsquery('english', '${keywordListRepacked}')
           AND ATS."id" = A."id"
         ORDER BY "startTime" DESC
         LIMIT ${MAX_SEARCH_RESULT}
        `;

    const [rows, _] = await sequelize.query(queryString).catch((err) => queryResultError(err, 'searchActivities'));
    return {
        keyword: keyword,
        count: rows.length,
        rows: rows
    };
};

export { getAllActivities, getActivity, searchActivities, updateActivity };
