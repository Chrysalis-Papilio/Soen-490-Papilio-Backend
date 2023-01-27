import { activityRepo } from '../repos';

const getAllActivities = async () => {
    return activityRepo.getAllActivities();
};

const getActivity = async (id: number) => {
    return activityRepo.getActivity(id);
};

export { getAllActivities, getActivity };
