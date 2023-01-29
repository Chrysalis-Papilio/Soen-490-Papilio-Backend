import { Activity } from '../models';

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

export { getAllActivities, getActivity };
