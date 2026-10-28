import { revalidatePath } from "next/cache";

/** Bust cached homepage so portfolio order matches admin after project edits. */
export function revalidatePublicSite() {
  revalidatePath("/");
}
