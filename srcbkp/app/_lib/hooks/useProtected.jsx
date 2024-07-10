import { redirect } from "next/navigation";
import useAuth from "./useAuth";

export default function Protected({ children }) {
  const isAuthenticated = useAuth();

  return isAuthenticated ? children : redirect("/");
}
