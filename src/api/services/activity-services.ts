import { activityRepo } from '../repos';

const getAllActivities = async () => {
    return activityRepo.getAllActivities();
};

export { getAllActivities };
