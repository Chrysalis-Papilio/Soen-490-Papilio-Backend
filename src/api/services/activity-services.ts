import { activityRepo } from '../repos';

const getAllActivities = async (page: number, size: number) => {
    return activityRepo.getAllActivities(page, size);
};

const getActivity = async (id: number) => {
    return activityRepo.getActivity(id);
};

const searchActivities = async (keyword: string) => {
    return activityRepo.searchActivities(keyword);
};

export { getAllActivities, getActivity, searchActivities };
