import { Activity } from '../models';

const getAllActivities = async () => {
    await Activity.sync();
    return Activity.findAll();
};

export { getAllActivities };
