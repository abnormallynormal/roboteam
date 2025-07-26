import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI!;

export async function PATCH(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const { document, username, specificFormName, bool } =
      await request.json();
    const db = client.db("roboteam");
    const result = await db.collection("forms").updateOne(
      {
        _id: new ObjectId(document),
        "responses.name": username,
        "responses.memberResponses.formName": specificFormName.name,
      },
      {
        $set: {
          "responses.$[user].memberResponses.$[form].completed": bool,
        },
      },
      {
        arrayFilters: [
          { "user.name": username },
          { "form.formName": specificFormName.name },
        ],
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
