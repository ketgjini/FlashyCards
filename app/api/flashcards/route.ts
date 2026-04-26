export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getClientPromise } from "../../lib/mongo";

export async function GET() {
  const client = await getClientPromise();
  const db = client.db("flashycards");

  const flashcards = await db.collection("cards").find({}).toArray();

  return NextResponse.json(
    flashcards.map((card) => ({
      ...card,
      _id: card._id.toString(),
    }))
  );
}

export async function POST(req: Request) {
  const body = await req.json();

  const client = await getClientPromise();
  const db = client.db("flashycards");

  const result = await db.collection("cards").insertOne(body);

  return NextResponse.json({
    _id: result.insertedId.toString(),
    ...body,
  });
}