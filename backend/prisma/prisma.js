const { PrismaClient } = require('@prisma/client');
let prisma;

/**
 * Initializes prisma client and connects to the database.
 */
function initializePrisma() {
    if (!prisma) {
        prisma = new PrismaClient();
        prisma.$connect();
    }
}

/**
 * Returns the current prisma client instance.
 * @returns PrismaClient
 */
function getPrisma() {
    if (!prisma) {
        initializePrisma();
    }
    return prisma;
}

module.exports = {
    initializePrisma,
    getPrisma,
};
