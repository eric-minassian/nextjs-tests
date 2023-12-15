import { db } from "@/server/db";
import { posts, type Post } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";
import { z } from "zod";
import { SubmitButton } from "./submit-button";

export default function HomePage() {
  return (
    <main>
      <h1 className="text-center text-4xl font-bold">Posts</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Posts />
      </Suspense>
      <h2 className="text-center text-4xl font-bold">Create Post</h2>
      <CreatePost />
    </main>
  );
}

async function Posts() {
  const postsData = await db.select().from(posts);

  return (
    <ul className="space-y-4 p-4">
      {postsData.map((post) => (
        <PostView post={post} key={post.id} />
      ))}
    </ul>
  );
}

function PostView({ post }: { post: Post }) {
  async function deletePostAction() {
    "use server";
    await db.delete(posts).where(eq(posts.id, post.id));

    revalidatePath("/");
  }

  return (
    <li className="space-y-2 rounded-md border p-4 shadow-md">
      <form action={deletePostAction}>
        <h2 className="text-2xl font-bold">{post.name}</h2>
        <p className="text-gray-500">Created: {String(post.createdAt)}</p>
        <p className="text-gray-500">Updated: {String(post.updatedAt)}</p>
        <SubmitButton>Delete</SubmitButton>
      </form>
    </li>
  );
}

const createPostSchema = z.object({
  name: z.string().min(1).max(100),
});

function CreatePost() {
  async function createPostAction(formData: FormData) {
    "use server";

    const validatedFields = createPostSchema.parse({
      name: formData.get("name"),
    });

    await db.insert(posts).values(validatedFields);

    revalidatePath("/");
  }

  return (
    <form action={createPostAction} className="space-y-4 p-4">
      <label htmlFor="name" className="block">
        Name
      </label>
      <input
        type="text"
        name="name"
        id="name"
        className="rounded-md border p-2"
      />
      <SubmitButton>Create</SubmitButton>
    </form>
  );
}
