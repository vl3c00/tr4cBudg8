"use server";

import prisma from "@/lib/prisma";
import { UpdateUserCurrencySchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function UpdateUserCurrency(currency: string) {
    const parsedBody = UpdateUserCurrencySchema.safeParse({
        currency,
    });

    if (!parsedBody.success) {
        throw parsedBody.error;
    }

    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    // Check if the userSettings exist
    let userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!userSettings) {
        // If userSettings don't exist, you can create it or handle the error
        userSettings = await prisma.userSettings.create({
            data: {
                userId: user.id,
                currency,
            },
        });
    } else {
        // If userSettings exist, update them
        userSettings = await prisma.userSettings.update({
            where: {
                userId: user.id,
            },
            data: {
                currency,
            },
        });
    }

    return userSettings;
}
