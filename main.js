const dotenv = require("dotenv").config();
const { MongoClient } = require("mongodb");

const main = async () => {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();

    await findByBedBathRecentViews(client, {minNumBed: 4, minNumBath: 2, maxNumOfResults:5})

    // await findOneListingByName(client, 'Loft-1')

    // await createMultipleListings(client, [
    //   {
    //     name: "Loft",
    //     summary: "nice loft",
    //     bedrooms: 1,
    //     bathrooms: 1,
    //   },
    //   {
    //     name: "Loft-1",
    //     summary: "nice loft",
    //     bedrooms: 2,
    //     bathrooms: 2,
    //   },
    //   {
    //     name: "Loft-2",
    //     summary: "nice loft",
    //     bedrooms: 3,
    //     bathrooms: 3,
    //   },
    // ]);

    // await listDatabases(client);

    // await createListing(client, {
    //     name: "Loft",
    //     summary: 'nice loft',
    //     bedrooms: 1,
    //     bathrooms: 1
    // });
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
};

main().catch(console.error);

const findByBedBathRecentViews = async (client, {minNumBed = 0, minNumBath = 0, maxNumOfResults = Number.MAX_SAFE_INTEGER} = {} ) =>{
    const cursor = await client.db('sample_airbnb').collection('listingsAndReviews').find({
        bedrooms: { $gte: minNumBed},
        bathrooms: { $gte: minNumBath}
    }).sort({ last_review: -1}).limit(maxNumOfResults);

    const results = await cursor.toArray();

    if (results.length > 0) {
        console.log(`Found listings with at least ${minNumBed} bedrooms and ${minNumBath} bathrooms`);
        results.forEach((result, i) => {
            date = new Date(results.last_review).toDateString();
            console.log('===================================');
            console.log(`${i + 1}. name: ${result.name}`);
        })
    }
} 

const findOneListingByName = async (client, nameOfListing) => {
    const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .findOne({ name: nameOfListing});

    if (result) {
        console.log(`Found a listing in the collection with the name: ${nameOfListing}`);
        console.log(result);
    } else {
        console.log(`No listings found in the collection with the name ${nameOfListing}`);
    }
}

const createMultipleListings = async (client, newListings) => {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .insertMany(newListings);
  console.log(
    `${result.insertedCount} new listings created with the following ids:`
  );
  console.log(result.insertedIds);
};

const createListing = async (client, newListing) => {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .insertOne(newListing);
  console.log(`New listing with the ID: ${result.insertedId}`);
};

const listDatabases = async (client) => {
  const databasesList = await client.db().admin().listDatabases();
  console.log("==========Databases=============");
  databasesList.databases.forEach((db) => {
    console.log(`- ${db.name}`);
  });
};
