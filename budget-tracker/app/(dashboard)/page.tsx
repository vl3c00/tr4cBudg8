import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from 'react'
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Overview from "./_components/Overview";

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect("sign-in");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect("/testWizard");
  }

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex items-center justify-between py-8"> {/* Added flex and justify-between here */}
          <p className="text-3xl font-bold">
            Hello, {user.firstName}! 👋
          </p>
          <div className="flex items-center gap-3"> {/* Buttons align to the right */}
            <CreateTransactionDialog 
              trigger={
                <Button variant={"outline"} className="border-emerald-500 bg-emarald-950 text-white hover:bg-emarald-700 hover:text-white">
                  New income  🤑
                </Button>
              } 
              type="income"
            />
            <CreateTransactionDialog 
              trigger={
                <Button variant={"outline"} className="border-rose-500 bg-rose-950 text-white hover:bg-emarald-700 hover:text-white">
                  New expense  🤧
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>

      <Overview userSettings={userSettings} />
    </div>
  );
}

export default page;
