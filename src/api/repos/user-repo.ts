import { Activity, Quiz, User, UsersJoinActivities } from '../models';
import { APIError } from '../../errors/api-error';
import { httpStatusCode } from '../../types/httpStatusCodes';
import { createNewObjectCaughtError, queryResultError } from './error';
import { StreamChat } from 'stream-chat';
import { activityFetchIncludeAttribute } from './activity-repo';

/** Get all accounts from table account */
const getAllUsers = async () => {
    await User.sync();
    return User.findAll({
        attributes: { exclude: ['id'] }
    });
};

/** Get User from firebase_id */
const getUserById = async (id: string) => {
    await User.sync();
    const user = await User.findOne({
        where: { firebase_id: id },
        attributes: { exclude: ['id'] }
    });
    return {
        found: !!user,
        user: user
    };
};

/**  Get User from email */
const getUserByEmail = async (email: string) => {
    await User.sync();
    const user = await User.findOne({
        where: { email: email },
        attributes: { exclude: ['id'] }
    });
    return {
        found: !!user,
        user: user
    };
};

/** Get The List of Activity Created by User */
const getUserActivityList = async (id: string) => {
    await User.sync();
    await Activity.sync();
    const user = (await getUserById(id)).user;
    if (!user) {
        throw new APIError(`Cannot find User with firebase_id ${id}`, 'getUserActivityList', httpStatusCode.CONFLICT);
    }
    return {
        count: (await user.countActivities()) || 0,
        activities: await user.getActivities({
            include: activityFetchIncludeAttribute
        })
    };
};

const getUserFavoriteActivityList = async (id: string) => {
    await User.sync();
    await Activity.sync();
    const user = (await getUserById(id)).user;
    if (!user) {
        throw new APIError(`Cannot find User with firebase_id ${id}`, 'getUserFavoriteActivityList', httpStatusCode.CONFLICT);
    }
    return {
        count: user.favoriteActivities.length || 0,
        activities: await Activity.findAll({
            where: { id: user.favoriteActivities },
            include: activityFetchIncludeAttribute
        })
    };
};

const checkActivityFavoritedByUser = async (id: string, activityId: number) => {
    await User.sync();
    await Activity.sync();
    const user = (await getUserById(id)).user;
    if (!user) {
        throw new APIError(`Cannot find User with firebase_id ${id}`, 'checkActivityFavoritedByUser', httpStatusCode.CONFLICT);
    }
    return {
        isActivityFound: user.favoriteActivities.includes(activityId)
    };
};

/**  Create a simple user with verified input */
const createUser = async (user: User) => {
    await User.sync();

    // Check if the user is already in the database, if so, do nothing
    const checkForAlreadyExistingUser = await getUserById(user.firebase_id);

    if (!checkForAlreadyExistingUser.found) {
        // @ts-ignore-error
        await User.create({
            firebase_id: user.firebase_id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone ? user.phone : undefined,
            countryCode: user.countryCode ? user.countryCode : undefined,
            bio: `Hello! I'm ${user.firstName}!`,
            favoriteActivities: user.favoriteActivities ? user.favoriteActivities : []
        }).catch((err) => createNewObjectCaughtError(err, 'createUser', 'There has been an error in creating the User.'));
        return httpStatusCode.CREATED;
    }
    return httpStatusCode.OK;
};

/** Update User */
const updateUser = async (identifier: any, update: any) => {
    await User.sync();
    const result = await User.update(update, { returning: ['firebase_id', 'firstName', 'lastName', 'countryCode', 'phone', 'email', 'bio', 'favoriteActivities', 'image'], where: identifier }).catch(
        (err) => createNewObjectCaughtError(err, 'updateUser', 'There has been an error in updating User.')
    );
    if (!result[0])
        //  Failure to update
        throw new APIError('The user does not exist.', 'updateUserProfile', httpStatusCode.CONFLICT, true);
    else
        return {
            success: !!result[1][0],
            update: result[1][0]
        };
};

/** Create a new Activity associated with this User */
const addNewUserActivity = async (id: string, activity: Activity) => {
    await User.sync();
    await Activity.sync();
    const user = (await getUserById(id)).user;
    if (!user) {
        throw new APIError(`Cannot find User with firebase_id ${id}`, 'addNewUserActivity', httpStatusCode.CONFLICT);
    }
    const newActivity = await user
        .createActivity(activity, { returning: true, include: activityFetchIncludeAttribute })
        .catch((err) => createNewObjectCaughtError(err, 'addNewUserActivity', 'There has been an error in creating a new user Activity'));
    return {
        success: !!newActivity,
        activity: newActivity
    };
};

/** Submit the quiz */
const submitQuiz = async (id: string, quiz: Quiz) => {
    await User.sync();
    await Quiz.sync();
    const user = (await getUserById(id)).user;
    if (!user) {
        throw new APIError(`Cannot find User with firebase_id ${id}`, 'submitQuiz', httpStatusCode.CONFLICT);
    }
    const oldQuiz = await user.getQuiz();
    if (!oldQuiz) {
        await user.createQuiz(quiz).catch((err) => createNewObjectCaughtError(err, 'submitQuiz', 'Could not submit new quiz...'));
        return httpStatusCode.CREATED;
    }
    await oldQuiz.update(quiz).catch((err) => createNewObjectCaughtError(err, 'submitQuiz', 'Could not update old quiz...'));
    return httpStatusCode.OK;
};

// Helper function to get the StreamChat singleton object
const getStreamChatClient = () => {
    // @ts-ignore - Typescript does not recognize the function signature for some reason even though it is there
    return StreamChat.getInstance(process.env.STREAM_CHAT_API_KEY, process.env.STREAM_CHAT_API_SECRET);
};

const generateChatTokenForUser = async (userId: string) => {
    const client = getStreamChatClient();
    return client.createToken(userId);
};

const createChat = async (userId: string, channelId: string, channelName: string) => {
    const client = getStreamChatClient();

    const channel = client.channel('messaging', channelId, {
        created_by_id: userId,
        name: channelName
    });
    await channel.create().catch((err: any) => createNewObjectCaughtError(err, 'createChat', 'There has been an error in creating a new chat'));

    // Add the user that created this channel as a member otherwise the channel will not appear in his list on the mobile app
    await channel.addMembers([userId]).catch((err: any) => createNewObjectCaughtError(err, 'createChat', 'There has been an error in adding the user as a member into the newly created chat'));

    return httpStatusCode.CREATED;
};

const deleteActivityChat = async (channelId: string) => {
    const client = getStreamChatClient();
    const channel = client.channel('messaging', channelId);
    await channel.delete().catch((err: any) => createNewObjectCaughtError(err, 'deleteActivityChat', 'There has been an error in deleting a chat'));
    return httpStatusCode.DELETED;
};

const addMemberToActivityChat = async (user_id: string, user_name: string, channel_id: string) => {
    const client = getStreamChatClient();
    const channel = client.channel('messaging', channel_id);
    await channel
        .addMembers([user_id], { text: user_name + ' joined the channel.', user_id: user_id })
        .catch((err) => createNewObjectCaughtError(err, 'addMemberToActivityChat', 'There has been an error in adding a member to a chat'));
    return httpStatusCode.OK;
};

const removeMemberFromActivityChat = async (user_id: string, channel_id: string) => {
    const client = getStreamChatClient();
    const channel = client.channel('messaging', channel_id);
    await channel.removeMembers([user_id]).catch((err: any) => createNewObjectCaughtError(err, 'removeMemberFromActivityChat', 'There has been an error in removing a member from the chat'));
    return httpStatusCode.OK;
};

const createNewStreamChatUser = async (user_id: string, user_name: string) => {
    const client = getStreamChatClient();
    await client
        .upsertUser({
            id: user_id,
            name: user_name
        })
        .catch((err) => createNewObjectCaughtError(err, 'createNewStreamChatUser', 'There has been an error in creating a new Stream Chat user'));
    return httpStatusCode.CREATED;
};

/** Check if the User joined the Activity */
const checkJoinedActivity = async (id: string, activityId: number) => {
    await User.sync();
    await Activity.sync();
    await UsersJoinActivities.sync();

    const user = await User.findOne({ where: { firebase_id: id } });
    if (!user) {
        throw new APIError(`Cannot find User with firebase_id ${id}`, 'joinActivity', httpStatusCode.CONFLICT);
    }
    const activity = await Activity.findByPk(activityId, {
        attributes: ['userId']
    });
    if (!activity) {
        throw new APIError(`Cannot find Activity with id ${id}`, 'joinActivity', httpStatusCode.CONFLICT);
    }
    // @ts-ignore
    const owned = activity.userId == id;
    const result = await UsersJoinActivities.findOne({ where: { activityId: activityId, userId: id } });
    return {
        joined: !!result,
        owned: owned
    };
};

/** Join an Activity */
const joinActivity = async (id: string, activityId: number) => {
    if ((await checkJoinedActivity(id, activityId)).joined) {
        return httpStatusCode.CONFLICT;
    } else {
        await UsersJoinActivities.create({
            activityId: activityId,
            userId: id
        });
        return httpStatusCode.CREATED;
    }
};

/** Unjoin an Activity */
const unjoinActivity = async (id: string, activityId: number) => {
    if ((await checkJoinedActivity(id, activityId)).joined) {
        await UsersJoinActivities.destroy({ where: { activityId: activityId, userId: id } });
        return httpStatusCode.NO_CONTENT;
    } else {
        return httpStatusCode.CONFLICT;
    }
};

const getJoinedActivities = async (id: string) => {
    await User.sync();
    await Activity.sync();

    const user = await User.findOne({ where: { firebase_id: id } });
    if (!user) {
        throw new APIError(`Cannot find User with firebase_id ${id}`, 'getJoinedActivities', httpStatusCode.CONFLICT);
    }
    const activities = await UsersJoinActivities.findAll({
        where: { userId: id },
        include: {
            model: Activity,
            as: 'activity'
        }
    }).catch((err) => queryResultError(err, 'getJoinedActivity'));
    return {
        userId: id,
        count: activities.length,
        // @ts-expect-error
        row: activities.map((activity) => activity.activity)
    };
};

export {
    getAllUsers,
    createUser,
    getUserById,
    getUserByEmail,
    getUserActivityList,
    getUserFavoriteActivityList,
    checkActivityFavoritedByUser,
    updateUser,
    addNewUserActivity,
    submitQuiz,
    generateChatTokenForUser,
    createChat,
    deleteActivityChat,
    addMemberToActivityChat,
    createNewStreamChatUser,
    removeMemberFromActivityChat,
    checkJoinedActivity,
    joinActivity,
    unjoinActivity,
    getJoinedActivities
};
