"use server"

import { signIn } from "@/auth"

export async function loginAction(formData: FormData) {
  formData.set("redirectTo", "/")
  await signIn("credentials", formData)
}
