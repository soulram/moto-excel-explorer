import { useAuthStore } from "@/lib/store";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useAuthStore(state => state.currentUser);
  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;