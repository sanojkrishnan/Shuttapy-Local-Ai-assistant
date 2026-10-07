import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs)); //ui utility function for merging class names with Tailwind CSS.
