const { MongoClient } = require('mongodb');

// Replace with your connection string
const uri = process.env.MONGODB_URI!;

async function main() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB!");

    // Select database & collection
    const database = client.db("roboteam");
    const collection = database.collection("users");

    // Insert a document (like a row in SQL)
    const newUser = { name: "John", age: 30, email: "john@example.com" };
    const result = await collection.insertOne(newUser);
    console.log("Inserted document:", result.insertedId);

    // Find documents
    const users = await collection.find({}).toArray();
    console.log("All users:", users);

  } finally {
    // Close connection
    await client.close();
  }
}

main().catch(console.error);