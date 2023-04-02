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

const searchActivities = async (keyword: string) => {
    return activityRepo.searchActivities(keyword);
};

const closeActivity = async (id: number) => {
    return activityRepo.updateActivity(id, { closed: true }, false);
};

const openActivity = async (id: number) => {
    return activityRepo.updateActivity(id, { closed: false }, false);
};

export { getAllActivities, getActivity, searchActivities, updateActivity, closeActivity, openActivity };
