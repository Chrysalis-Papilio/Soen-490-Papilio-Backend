import { Activity } from '../models';
import { BaseError } from '../../errors/base-error';
import { httpStatusCode } from '../../types/httpStatusCodes';

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
        where: { id: id },
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

export { getAllActivities, getActivity, updateActivity };
