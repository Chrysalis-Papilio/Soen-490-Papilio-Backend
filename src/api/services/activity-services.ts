import { activityRepo } from '../repos';

const getAllActivities = async (page: number, size: number) => {
    return activityRepo.getAllActivities(page, size);
};

const getActivity = async (id: number) => {
    return activityRepo.getActivity(id);
};

export { getAllActivities, getActivity };
