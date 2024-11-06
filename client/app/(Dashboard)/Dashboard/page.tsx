import { currentUser, User } from "@clerk/nextjs/server";
import { getInitials } from "@/lib/utils";
import UploadVideoArea from "@/components/shared/UploadVideoArea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Component() {
  const { imageUrl, firstName, lastName, emailAddresses } =
    (await currentUser()) as User;
  const emailId = emailAddresses[0]?.emailAddress;

  const fullName = `${firstName} ${lastName}`;
  return (
    <main className="flex-1 overflow-y-auto bg-white">
      <div className="container mx-auto grid gap-6 p-4 sm:p-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-lg ">
            <Avatar className="h-20 w-20 border-2 border-amber-500">
              <AvatarImage src={imageUrl} alt={fullName} />
              <AvatarFallback className="bg-amber-500 text-slate-900 text-xl font-bold">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="text-2xl font-semibold text-amber-500">
                {fullName}
              </div>
              <div className="text-sm text-slate-400">{emailId}</div>
            </div>
          </div>
          <UploadVideoArea />
        </div>
      </div>
    </main>
  );
}
