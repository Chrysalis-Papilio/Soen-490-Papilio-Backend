import { Activity } from '../models';
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

/** Search for Activities using the provided 'keyword' */
const searchActivities = async (keyword: string) => {
    // Repack the keyword string to be usable in pgsql to_tsquery()
    // And we don't want to use phraseto_tsquery() because we don't need to match the order of words
    const keywordListRepacked = keyword
        .split(' ')
        .filter((item) => {
            return item.trim().length > 0;
        })
        .join(' & ');

    const MAX_SEARCH_RESULT = 30;
    const queryString =
        // QUERY TO SEARCH FOR ACTIVITIES USING FULL-TEXT SEARCH
        `SELECT A."id", "title", "description", "images"[1]
         FROM "Activities_Tokens_Search" ATS,
              "Activities" A
         WHERE ("description_tokens" @@ to_tsquery('english', '${keywordListRepacked}')
             OR "title_tokens" @@ to_tsquery('english', '${keywordListRepacked}')
             )
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

export { getAllActivities, getActivity, searchActivities };
