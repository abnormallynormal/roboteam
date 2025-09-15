import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import { Member } from "@/app/members/columns";
const uri = process.env.MONGODB_URI!;

export async function GET(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("roboteam");
    const forms = await db.collection("forms").find().toArray();

    await client.close();
    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const { name, type, amount, suppForms, teamMembers} = await request.json();
    const items: any[] = [];
    const responses: any[] = [];
    const db = client.db("roboteam");
    items.push({
      name: name,
      type: type,
      amount: type.toString() === "Payment" ? amount : 0
    });
    suppForms.map((item: any) => {
      items.push({
        name: item.name,
        type: item.type,
        amount: item.type.toString() === "Payment" ? item.amount : 0,
      });
    });
    teamMembers.flatMap((member: Member) => {
      responses.push({
        id: new ObjectId(),
        name: member.name,
        team: member.team,
        memberResponses: items.map((item) => ({
          formName: item.name,
          completed: false
        }))
      })
    });
    const result = await db.collection("forms").insertOne({
      _id: new ObjectId(),
      name: name,
      cols: items,
      responses: responses
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating forms:", error);
    return NextResponse.json(
      { error: "Failed to update forms" },
      { status: 500 }
    );
  }
}
