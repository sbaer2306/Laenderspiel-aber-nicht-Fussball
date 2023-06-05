const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');


const prisma = new PrismaClient()
const USER_COUNT = 20; // How many users should be created?

/**
 * Country seeding from countries.json file.
 */
async function seedCountries() {

    const rawData = fs.readFileSync(path.resolve(__dirname, 'initial-country-data/countries.json'));
    const { data: countries } = JSON.parse(rawData);

    for (let country of countries) {
        await prisma.country.create({
            data: {
                name: country.name,
                countryCode: country.countryCode,
                difficultyMultiplier: country.difficultyMultiplier,
            },
        });
        console.log(`Inserted ${country.name} into the database.`);
    }
}

/**
 * Deletes all data from the database.
 */
async function purgeDatabase() {
    console.log('Alte Daten werden gelöscht...')
    await prisma.monthlyRanking.deleteMany()
    await prisma.allTimeRanking.deleteMany()
    await prisma.playedGame.deleteMany()
    await prisma.profile.deleteMany()
    await prisma.user.deleteMany()
    await prisma.country.deleteMany();
    console.log('Alte Daten wurden gelöscht...')
}

/**
 * Seeds the database with non-static data. (Users,Profiles, Rankings, Played Games)
 */
async function seedNonStaticData() {
    console.log('Seeding countries...')
    await seedCountries();
    const firstCountry = await prisma.country.findFirst({ select: { id: true } });
    const firstCountryId = firstCountry?.id;
    const lastCountry = await prisma.country.findFirst({ select: { id: true }, orderBy: { id: 'desc' } });
    const lastCountryId = lastCountry?.id;

    console.log('First Country ID:', firstCountryId);
    console.log('Last Country ID:', lastCountryId);

    console.log('Seeding user related data...')

    for (let i = 0; i < USER_COUNT; i++) {

        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                OAuthID: `oauth${i}-placeholder`,
                username: faker.internet.userName(),
                registrationDate: faker.date.past(),
                lastLoginDate: faker.date.recent(),
                Profile: {
                    create: {
                        firstName: faker.person.firstName(),
                        lastName: faker.person.lastName(),
                        isPrivate: faker.datatype.boolean(),
                        bio: faker.lorem.sentence(),
                        location: faker.location.city(),
                    },
                },
            },
        })

        await prisma.allTimeRanking.create({
            data: {
                userId: user.id,
                score: faker.number.int(10000),
            },
        })

        // Monthly ranking for each month of the year 2023
        for (let month = 0; month < 12; month++) {
            await prisma.monthlyRanking.create({
                data: {
                    userId: user.id,
                    score: faker.number.int(1000),
                    month: month + 1,
                    year: 2023,
                },
            })
        }

        for (let j = 0; j < faker.number.int(50) + 5; j++) {
            await prisma.playedGame.create({
                data: {
                    userId: user.id,
                    score: faker.number.int(100),
                    gameDuration: faker.number.int({ min: 60, max: 580 }),
                    countryId: faker.number.int({ min: firstCountryId, max: lastCountryId }),
                },
            })
        }
    }

    console.log('Seeding done!')
}

async function main() {
    await purgeDatabase();
    await seedNonStaticData();
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
