import { Query } from '../config/psql';

// const NAMESPACE = 'DatabaseServices';

const queryDatabase = async (query: string) => {
    try {
        return Query(query);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export { queryDatabase };
