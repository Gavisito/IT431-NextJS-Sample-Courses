import { NextResponse } from "next/server";
import { Course } from "@/types/course";
import clientPromise from "@/lib/mongodb";

// GET: Retrieve all courses
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("coursesDb");
    //this gets all of the entry courses
    const courses = await db.collection("courses").find({}).toArray();
    return NextResponse.json(courses, {status:200});
  } catch (error) {
    console.error("Error retrieving courses:", error);
    return NextResponse.json(
      { error: "Failed to retrieve courses." },
      { status: 500 }
    );
  }
}

// POST: Add a new course
export async function POST(request: Request) {
  try {
    const newCourse: Omit<Course, "id"> = await request.json();
    const client = await clientPromise;
    const db = client.db("coursesDb");

    const lastCourse = await db
    .collection("courses")
    .findOne({}, {sort: {id: -1}});
    const nextId = lastCourse ? lastCourse.id + 1 : 1;

    const courseToInsert = {...newCourse, id:nextId};
    const result = await db.collection("courses").insertOne(courseToInsert);

    if (!result.acknowledged){
      throw new Error("failed to insert course")
    }

    return NextResponse.json(courseToInsert, { status: 201 });
  } catch (error) {
    console.error("Error adding course:", error);
    return NextResponse.json(
      { error: "Failed to add course." },
      { status: 500 }
    );
  }
}
