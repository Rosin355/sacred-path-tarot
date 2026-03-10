import { SpiralAnimation } from "@/components/ui/spiral-animation";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const routeMap: Record<string, string> = {
  arcani: "/arcani",
  respiro: "/respiro",
  ispirazione: "/ispirazione",
};

const Transition = () => {
  const { via } = useParams<{ via: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const target = routeMap[via || ""] || "/";
    const timer = setTimeout(() => navigate(target, { replace: true }), 4000);
    return () => clearTimeout(timer);
  }, [via, navigate]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-background">
      <div className="absolute inset-0">
        <SpiralAnimation />
      </div>
    </div>
  );
};

export default Transition;
