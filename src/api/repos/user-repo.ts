import { Activity, Quiz, User } from "../models";
import { APIError } from "../../errors/api-error";
import { httpStatusCode } from "../../types/httpStatusCodes";
import { createNewObjectCaughtError } from "./error";
import { StreamChat } from "stream-chat";

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
        activities: await user.getActivities()
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
            where: { id: user.favoriteActivities }
        })
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
    const result = await User.update(update, { returning: ['firebase_id', 'firstName', 'lastName', 'countryCode', 'phone', 'email', 'bio', 'favoriteActivities'], where: identifier }).catch((err) =>
        createNewObjectCaughtError(err, 'updateUser', 'There has been an error in updating User.')
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
        .createActivity(activity, { returning: true })
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

const generateChatTokenForUser = async (userId: string) => {
    // @ts-ignore
    const client = StreamChat.getInstance(process.env.STREAM_CHAT_API_KEY, process.env.STREAM_CHAT_API_SECRET);
    return client.createToken(userId);
};

const createChat = async (userId: string, channelId: string, channelName: string) => {
    // @ts-ignore
    const client = StreamChat.getInstance(process.env.STREAM_CHAT_API_KEY, process.env.STREAM_CHAT_API_SECRET);

    const channel = client.channel('messaging', channelId, {
        created_by_id: userId,
        name: channelName
    });
    await channel.create()
      .catch((err) => createNewObjectCaughtError(err, 'createChat', 'There has been an error in creating a new chat'));

    return httpStatusCode.CREATED;
};

const deleteActivityChat = async (channelId: string) => {
    // @ts-ignore
    const client = StreamChat.getInstance(process.env.STREAM_CHAT_API_KEY, process.env.STREAM_CHAT_API_SECRET);
    const channel = client.channel('messaging', channelId);
    await channel.delete().catch((err) => createNewObjectCaughtError(err, 'deleteActivityChat', 'There has been an error in deleting a chat'));
    return httpStatusCode.DELETED;
};

const addMemberToActivityChat = async (user_id: string, user_name: string, channel_id: string) => {
    // @ts-ignore
    const client = StreamChat.getInstance(process.env.STREAM_CHAT_API_KEY, process.env.STREAM_CHAT_API_SECRET);
    const channel = client.channel('messaging', channel_id);
    await channel.addMembers([user_id], { text: user_name + ' joined the channel.', user_id: user_id })
      .catch((err) => createNewObjectCaughtError(err, 'addMemberToActivityChat', 'There has been an error in adding a member to a chat'));
    return httpStatusCode.OK;
};

const createNewStreamChatUser = async (user_id: string, user_name: string) => {
    // @ts-ignore
    const client = StreamChat.getInstance(process.env.STREAM_CHAT_API_KEY, process.env.STREAM_CHAT_API_SECRET);
    await client.upsertUser({
        id: user_id,
        name: user_name
     }).catch((err) => createNewObjectCaughtError(err, 'createNewStreamChatUser', 'There has been an error in creating a new Stream Chat user'));
    return httpStatusCode.CREATED;
};

export { getAllUsers, createUser, getUserById, getUserByEmail, getUserActivityList, getUserFavoriteActivityList, updateUser, addNewUserActivity, submitQuiz, generateChatTokenForUser, createChat, deleteActivityChat, addMemberToActivityChat, createNewStreamChatUser };
