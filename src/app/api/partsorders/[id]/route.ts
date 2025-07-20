import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI!;

export async function GET(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("roboteam");
    const orders = await db.collection("partsorders").find().toArray();

    await client.close();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const { id } = await params;

    const db = client.db("roboteam");
    const result = await db.collection("partsorders").deleteOne({
      _id: new ObjectId(id),
    });

    await client.close();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const { id } = await params;
    const { partname, quantity, price } = await request.json();

    const db = client.db("roboteam");
    const result = await db.collection("partsorders").updateOne({
      _id: new ObjectId(id),
    }, {
      $set: {
        partname,
        quantity,
        price,
      }
    });

    await client.close();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}