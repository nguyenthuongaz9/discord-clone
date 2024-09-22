import { db } from './db' 

const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;

const deleteInactiveUsers = async () => {
    const oneYearAgo = new Date(Date.now() - ONE_YEAR_IN_MS); 

    const inactiveUsers = await db.profile.findMany({
        where: {
            lastLogin: {
                lt: oneYearAgo,
            },
        },
    });

    if (inactiveUsers.length > 0) {
        const userIdsToDelete = inactiveUsers.map(user => user.userId);

        await db.profile.deleteMany({
            where: {
                userId: {
                    in: userIdsToDelete,
                },
            },
        });

        console.log(`Đã xóa ${userIdsToDelete.length} người dùng không hoạt động.`);
    } else {
        console.log('Không có người dùng nào cần xóa.');
    }
};

export default deleteInactiveUsers;
