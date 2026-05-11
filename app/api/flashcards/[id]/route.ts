import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getClientPromise } from "@/app/lib/mongo";

export const runtime = "nodejs";

// GET
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const client = await getClientPromise();
    const db = client.db("flashycards");

    const flashcard = await db.collection("cards").findOne({
        _id: new ObjectId(id),
    });

    if (!flashcard) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
        ...flashcard,
        _id: flashcard._id.toString(),
    });
}

// PATCH
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await req.json();

    const client = await getClientPromise();
    const db = client.db("flashycards");

    const result = await db.collection("cards").updateOne(
        { _id: new ObjectId(id) },
        { $set: body }
    );

    return NextResponse.json({
        success: true,
        modifiedCount: result.modifiedCount,
    });
}

// DELETE
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const client = await getClientPromise();
    const db = client.db("flashycards");

    const result = await db.collection("cards").deleteOne({
        _id: new ObjectId(id),
    });

    return NextResponse.json({
        success: true,
        deletedCount: result.deletedCount,
    });
}