import { activityRepo } from '../repos';

const getAllActivities = async (page: number, size: number) => {
    return activityRepo.getAllActivities(page, size);
};

const getActivity = async (id: number, contact: boolean = false) => {
    return activityRepo.getActivity(id, contact);
};

const updateActivity = async (id: number, update: any) => {
    return activityRepo.updateActivity(id, update);
};

const searchActivities = async (keyword: string) => {
    return activityRepo.searchActivities(keyword);
};

export { getAllActivities, getActivity, searchActivities, updateActivity };
