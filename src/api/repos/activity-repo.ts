import { Activity, Business, User } from '../models';
import { BaseError } from '../../errors/base-error';
import { httpStatusCode } from '../../types/httpStatusCodes';
import sequelize from '../../config/sequelize';
import { queryResultError } from './error';
import { APIError } from '../../errors/api-error';

export const activityFetchIncludeAttribute = [
    {
        model: Business,
        attributes: ['businessId', 'email'], // customizable
        as: 'business'
    },
    {
        model: User,
        attributes: ['firebase_id', 'email'], // customizable
        as: 'user'
    }
];

/** Get all available Activities with pagination */
const getAllActivities = async (page: number, size: number) => {
    await Activity.sync();
    const result = await Activity.findAndCountAll({
        limit: size,
        offset: (page - 1) * size,
        attributes: { exclude: ['businessId', 'userId', 'createdAt', 'updatedAt'] },
        include: activityFetchIncludeAttribute
    }).catch((e) => queryResultError(e, 'getAllActivities'));
    return {
        ...result,
        totalPages: Math.ceil(result.count / size),
        currentPage: page
    };
};

/** Get details of a particular Activity using 'id' */
const getActivity = async (id: number) => {
    await Activity.sync();
    const activity = await Activity.findByPk(id, {
        attributes: { exclude: ['businessId', 'userId'] },
        include: activityFetchIncludeAttribute
    }).catch((e) => queryResultError(e, 'getActivitiy'));
    return {
        found: !!activity,
        activity: activity
    };
};

/** Update details of the Activity */
const updateActivity = async (id: number, update: any, returning = true) => {
    await Activity.sync();
    const result = await Activity.update(update, {
        where: { id },
        returning: true
    }).catch((err) => {
        console.log(err);
        throw new BaseError('ORM Sequelize Error', 'There has been an error in updating the Activity', 'updateActivity', httpStatusCode.INTERNAL_SERVER, true);
    });
    if (result[0] == 0) throw new APIError(`Cannot find Activity with id ${id}`, 'updateActivity', httpStatusCode.CONFLICT);
    if (returning)
        return {
            success: true,
            activity: result[1][0]
        };
    else return { success: true };
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
