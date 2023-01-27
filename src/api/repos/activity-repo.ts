import { Activity } from '../models';

const getAllActivities = async () => {
    await Activity.sync();
    return Activity.findAll();
};

const getActivity = async (id: number) => {
    await Activity.sync();
    const activity = await Activity.findByPk(id);
    return {
        found: !!activity,
        activity: activity
    };
};

export { getAllActivities, getActivity };
