import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";  // Use getAuth from @clerk/nextjs/server
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  // Use getAuth to retrieve the current user from the request
  const { user } = getAuth(request);  // Correctly access the user from the request

  if (!user) {
    redirect("/sign-in");
  }

  // Find user settings
  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,  // Use the user ID for querying
    },
  });

  // If user settings don't exist, create default settings
  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: "USD",  // Default currency
      },
    });
  }

  // Revalidate the path
  revalidatePath("/");

  // Return user settings as a JSON response
  return Response.json(userSettings);
}
 