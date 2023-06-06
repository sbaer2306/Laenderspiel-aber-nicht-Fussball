const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();

const BASE_URL = "http://localhost:8000";

/**
 * Retrieves played games by user.
 * 
 * @param {number} userId - The ID of the user.
 * @param {number} [page=1] - The page number to retrieve. Default is 1.
 * @param {number} [pageSize=20] - The size of the page to retrieve. Default page size is 20.
 * @returns {Promise<Object>} - The response object containing the retrieved played games.
 *     - totalItems: The total number of items.
 *     - totalPages: The total number of pages.
 *     - currentPage: The current page number.
 *     - pageSize: The page size.
 *     - playedGames: An array of played games.
 *     - _links: The links object containing the self, next, and prev URLs.
 *         - self: The self URL.
 *         - next: The next URL. Null if there is no next page.
 *         - prev: The previous URL. Null if there is no previous page.
 */
const getPlayedGamesByUser = async (userId, page = 1, pageSize = 20) => {
    const parsedId = parseInt(userId);
    const parsedPageSize = parseInt(pageSize);

    const totalItems = await prismaClient.playedGame.count({ where: { userId: parsedId } });
    const playedGames = await prismaClient.playedGame.findMany({
        where: { userId: parsedId },
        take: parsedPageSize,
        skip: (page - 1) * parsedPageSize,
        orderBy: { createdAt: 'desc' },
        include: { country: true },
    });

    const totalPages = Math.ceil(totalItems / parsedPageSize);

    const apiPath = `/user/${userId}/played-games`;
    const createPageUrl = (pageNumber) => `${BASE_URL}${apiPath}?page=${pageNumber}&pageSize=${parsedPageSize}`;

    const prevPage = page > 1 ? createPageUrl(parseInt(page) - 1) : null;
    const selfPage = `${BASE_URL}${apiPath}?page=${page}&pageSize=${parsedPageSize}`;
    const nextPage = page < totalPages ? createPageUrl(parseInt(page) + 1) : null;


    const response = {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: parsedPageSize,
        playedGames,
        _links: {
            self: { href: selfPage },
            next: nextPage ? { href: nextPage } : null,
            prev: prevPage ? { href: prevPage } : null,
        },
    };

    return response;
};

/**
 * Deletes all played games by user.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Object>} - The number of deleted objects.
 *     - deletedNum: The total number of deleted items.
 */
const deletePlayedGamesByUser = async (userId) => {
    const parsedId = parseInt(userId);

    const deleteCount = await prismaClient.playedGame.deleteMany({
        where: { userId: parsedId },
    });

    return { deletedNum: deleteCount.count };
};

module.exports = { getPlayedGamesByUser, deletePlayedGamesByUser };