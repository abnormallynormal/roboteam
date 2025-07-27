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
      name: "Long C Channel 25 Hole + (Including on Robot)",
      category: "Metal",
      amount: 0,
      description: "",
    },
    {
      name: "Long L Channel 25 Hole + (Including on Robot)",
      category: "Metal",
      amount: 0,
      description: "",
    },
    {
      name: "Long 3 wide 25 Hole + (Including on Robot)",
      category: "Metal",
      amount: 0,
      description: "",
    },
    {
      name: "3.25in Omni Wheels",
      category: "Wheels",
      amount: 0,
      description: "",
    },
    {
      name: "2.75in Omni Wheels",
      category: "Wheels",
      amount: 0,
      description: "",
    },
    {
      name: "3.25in Traction Wheels",
      category: "Wheels",
      amount: 0,
      description: "",
    },
    {
      name: "2.75in Traction Wheels",
      category: "Wheels",
      amount: 0,
      description: "",
    },
    {
      name: "11w Motors",
      category: "Motors",
      amount: 0,
      description: "",
    },
    {
      name: "5.5w Motors",
      category: "Motors",
      amount: 0,
      description: "",
    },
    {
      name: "Radio(s)",
      category: "Electronics",
      amount: 0,
      description: "",
    },
    {
      name: "Rotation Sensor V2",
      category: "Electronics",
      amount: 0,
      description: "",
    },
    {
      name: "IMU(s)",
      category: "Electronics",
      amount: 0,
      description: "",
    },
    {
      name: "# of Brain Ports working",
      category: "Electronics",
      amount: 0,
      description: "",
    },
    {
      name: "Batteries",
      category: "Electronics",
      amount: 0,
      description: "",
    },
    {
      name: "Battery Charger",
      category: "Electronics",
      amount: 0,
      description: "",
    },
    {
      name: "48T HS Gears",
      category: "Gears",
      amount: 0,
      description: "",
    },
    {
      name: "36T LS Gears",
      category: "Gears",
      amount: 0,
      description: "",
    },
    {
      name: "36T HS Gears",
      category: "Gears",
      amount: 0,
      description: "",
    },
    {
      name: "25mm Cylinders",
      category: "Pneumatics",
      amount: 0,
      description: "",
    },
    {
      name: "50mm Cylinders",
      category: "Pneumatics",
      amount: 0,
      description: "",
    },
    {
      name: "75mm Cylinders",
      category: "Pneumatics",
      amount: 0,
      description: "",
    },
    {
      name: "Air Tank V1",
      category: "Pneumatics",
      amount: 0,
      description: "",
    },
    {
      name: "Air Tank V2",
      category: "Pneumatics",
      amount: 0,
      description: "",
    },
    {
      name: "T Fittings",
      category: "Pneumatics",
      amount: 0,
      description: "",
    },
    {
      name: "V1 Solenoids",
      category: "Pneumatics",
      amount: 0,
      description: "",
    },
    {
      name: "V2 Solenoids",
      category: "Pneumatics",
      amount: 0,
      description: "",
    },
    {
      name: "V1 Solenoid Cable",
      category: "Pneumatics",
      amount: 0,
      description: "",
    },
    {
      name: "V2 Solenoid Cable",
      category: "Pneumatics",
      amount: 0,
      description: "",
    },
    {
      name: "Screwdriver (Normal Tip)",
      category: "Tools",
      amount: 0,
      description: "",
    },
    {
      name: "Wrenches",
      category: "Tools",
      amount: 0,
      description: "",
    },
    {
      name: "2in OD Flex wheels (Light Grey)",
      category: "Wheels",
      amount: 0,
      description: "",
    },
    {
      name: "Blocks",
      category: "Game Elements",
      amount: 0,
      description: "",
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
