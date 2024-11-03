import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string) => {
  const [firstName, lastName] = name.split(" ");
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
};

export const statusColor: { [key: string]: string } = {
  FINISHED: "bg-green-500 text-green-50",
  PENDING: "bg-yellow-500 text-yellow-50",
  FAILED: "bg-red-500 text-red-50",
};

export const sanitizeFileName = (fileName: string) => {
  console.log(`Sanitizing file name: ${fileName}`);
  return fileName
    .replace(/[^\w\s]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .trim()
    .replace(/^_+|_+$/g, "");
};
