import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI!;

export async function GET(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("inventory");

    const collections = await db.listCollections().toArray();

    const result = Object.fromEntries(
      await Promise.all(
        collections.map(async (col) => [
          col.name,
          await db.collection(col.name).find().toArray(),
        ])
      )
    );

    await client.close();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const defaultItemsArray: any[] = [
  {
    "name": "11W Motors",
    "category": "Motors",
    "amount": 0,
    "description": ""
  },
  {
    "name": "5.5W Motors",
    "category": "Motors",
    "amount": 0,
    "description": ""
  },
  {
    "name": "Radios",
    "category": "Electronics",
    "amount": 0,
    "description": ""
  },
  {
    "name": "Brains",
    "category": "Electronics",
    "amount": 0,
    "description": ""
  },
  {
    "name": "Controllers",
    "category": "Electronics",
    "amount": 0,
    "description": ""
  },
  {
    "name": "Battery",
    "category": "Electronics",
    "amount": 0,
    "description": ""
  },
  {
    "name": "Battery Charger",
    "category": "Electronics",
    "amount": 0,
    "description": ""
  },
  {
    "name": "600 RPM Carts",
    "category": "Motors",
    "amount": 0,
    "description": ""
  },
  {
    "name": "Distance sensor",
    "category": "Sensors",
    "amount": 0,
    "description": ""
  },
  {
    "name": "Optical sensor",
    "category": "Sensors",
    "amount": 0,
    "description": ""
  },
  {
    "name": "Rotational sensor",
    "category": "Sensors",
    "amount": 0,
    "description": ""
  },
  {
    "name": "Vision sensor",
    "category": "Sensors",
    "amount": 0,
    "description": ""
  },
  {
    "name": "Inertial sensor",
    "category": "Sensors",
    "amount": 0,
    "description": ""
  },
  {
    "name": "Power cable",
    "category": "Electronics",
    "amount": 0,
    "description": ""
  },
  {
    "name": "25mm piston single",
    "category": "Pneumatics",
    "amount": 0,
    "description": ""
  },
  {
    "name": "25mm piston double",
    "category": "Pneumatics",
    "amount": 0,
    "description": ""
  },
  {
    "name": "50mm piston single",
    "category": "Pneumatics",
    "amount": 0,
    "description": ""
  },
  {
    "name": "50mm piston double",
    "category": "Pneumatics",
    "amount": 0,
    "description": ""
  },
  {
    "name": "75mm piston single",
    "category": "Pneumatics",
    "amount": 0,
    "description": ""
  },
  {
    "name": "75mm piston double",
    "category": "Pneumatics",
    "amount": 0,
    "description": ""
  },
  {
    "name": "Solenoid single",
    "category": "Pneumatics",
    "amount": 0,
    "description": ""
  },
  {
    "name": "Solenoid double",
    "category": "Pneumatics",
    "amount": 0,
    "description": ""
  },
  {
    "name": "Air tank 50",
    "category": "Pneumatics",
    "amount": 0,
    "description": ""
  },
  {
    "name": "Air tank 75",
    "category": "Pneumatics",
    "amount": 0,
    "description": ""
  }
];
  function createDefaultItems() {
    return defaultItemsArray.map((item) => ({
      ...item,
      id: new ObjectId(), // Generate new ObjectId each time
    }));
  }
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const { name, defaultItems } = await request.json();
    const db = client.db("inventory");
    // const collections = await db.listCollections({ name }).toArray();
    // if (collections.length > 0) {
    //   return NextResponse.json(
    //     { error: "Collection already exists" },
    //     { status: 409 }
    //   );
    // }
    if (defaultItems === "true") {
      await db.collection(name).insertMany([
        { team: "g-team", items: createDefaultItems() },
        { team: "s-team", items: createDefaultItems() },
        { team: "t-team", items: createDefaultItems() },
        { team: "x-team", items: createDefaultItems() },
        { team: "y-team", items: createDefaultItems() },
        { team: "z-team", items: createDefaultItems() },
      ]);
    } else {
      await db.collection(name).insertMany([
        { team: "g-team", items: [] },
        { team: "s-team", items: [] },
        { team: "t-team", items: [] },
        { team: "x-team", items: [] },
        { team: "y-team", items: [] },
        { team: "z-team", items: [] },
      ]);
    }
    return NextResponse.json({success: true, message: "Collection created successfully"});
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}
