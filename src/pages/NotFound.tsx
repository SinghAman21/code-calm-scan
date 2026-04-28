import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="panel-shell max-w-xl rounded-[2rem] p-8 text-center">
        <div className="panel-title">404 / routing anomaly</div>
        <h1 className="mt-4 text-[5rem] font-display uppercase leading-none tracking-[-0.12em] text-foreground">Lost</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-8 text-muted-foreground">
          The route `{location.pathname}` does not exist in the current interface map.
        </p>
        <Link
          to="/"
          className="magnetic-hover mt-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Return home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
