import { activityRepo } from '../repos';

const getAllActivities = async (page: number, size: number) => {
    return activityRepo.getAllActivities(page, size);
};

const getActivity = async (id: number) => {
    return activityRepo.getActivity(id);
};

const updateActivity = async (id: number, update: any) => {
    return activityRepo.updateActivity(id, update);
};

export { getAllActivities, getActivity, updateActivity };
