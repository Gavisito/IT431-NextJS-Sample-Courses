import { NextResponse } from "next/server";
import { Course } from "@/types/course";
import clientPromise from "@/lib/mongodb";

// GET: Retrieve a course by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params
) {
  try {
    const { id } = await context.params; // Await params before accessing
    const courseId = parseInt(id, 10);

    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("coursesDb");

    //const course = courses.find((c) => c.id === courseId);
    // only find one entry with a specified id
    const course = await db
    .collection("courses")
    .findOne({id:courseId}); 

    // if (!course) {
    //   return NextResponse.json({ error: "Course not found." }, { status: 404 });
    // }
    
    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error retrieving course:", error);
    return NextResponse.json(
      { error: "Failed to retrieve course." },
      { status: 500 }
    );
  }
}

// PUT: Update a course by ID
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params
) {
  try {
    const { id } = await context.params; // Await params before accessing
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID." },
        { status: 400 }
      );
    }

    const userRequest: Partial<Course> = await request.json();
    const client = await clientPromise;
    const db = client.db("coursesDb");

    const course = await db.collection("courses").findOne({id: courseId});
  
    //makes an object to copy and overwrite fields that are both there such as description in both objects. "any" remove type requirement so null can exist
    const updateInfo: any = {...course, ...userRequest};

    //dot notation to remove the _id from mongodb, otherwise there will be an error of mutating the immutable when updating \(+>+)/
    delete updateInfo._id;

    //this updates only the field entered by the user
    const courseUpdate = await db.collection("courses").updateOne({ id: courseId}, { $set: updateInfo})

    return NextResponse.json(courseUpdate, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a course by ID
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params
) {
  try {
    const { id } = await context.params; // Await params before accessing
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("coursesDb");

    const deleteCourse = db.collection("courses").deleteOne({id: courseId});

    return NextResponse.json(
      { message: `Course with ID ${courseId} deleted.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course." },
      { status: 500 }
    );
  }
}

