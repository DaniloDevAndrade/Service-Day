"use server";

import { signOut } from "../../../../auth";

export default async function actionLogout() {
  await signOut();
}
