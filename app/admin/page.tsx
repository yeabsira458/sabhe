import { redirect } from "next/navigation";

// /admin is retired — Items page covers the same functionality
export default function AdminPage() {
  redirect("/Items");
}