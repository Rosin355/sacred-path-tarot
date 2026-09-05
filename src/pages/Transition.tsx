import { Navigate, useParams } from "react-router-dom";

const routeMap: Record<string, string> = {
  arcani: "/arcani",
  respiro: "/respiro",
  ispirazione: "/ispirazione",
};

const Transition = () => {
  const { via } = useParams<{ via: string }>();
  return <Navigate to={routeMap[via || ""] || "/"} replace />;
};

export default Transition;
