import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI!;

export async function POST(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const { collection, team, name, category, amount, description } =
      await request.json();
    const db = client.db("inventory");
    const result = await db.collection(collection).updateOne(
      {
        team: team,
      },
      {
        $push: {
          items: {
            id: new ObjectId().toString(),
            name: name,
            category: category,
            amount: amount,
            description: description,
          } as never,
        },
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const { collection, team, id, update, value } = await request.json();
    const db = client.db("inventory");
    console.log(id);
    console.log(collection);
    console.log(team);
    console.log(value);
    const result = await db
      .collection(collection)
      .updateOne(
        { team: team, items: { id: id } },
        { $set: { category: value } }
      );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const { collection, team, id } = await request.json();
    const db = client.db("inventory");

    const result = await db
      .collection(collection)
      .updateOne({ team: team }, { $pull: { items: { id: id } as never } });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
