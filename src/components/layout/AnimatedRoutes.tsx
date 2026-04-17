import { AnimatePresence } from "framer-motion";
import { useLocation, Routes, Route } from "react-router-dom";
import { ROUTES } from "@/config/routes";

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {ROUTES.map((route) => (
          <Route key={route.path} path={route.path} element={<route.element />} />
        ))}
      </Routes>
    </AnimatePresence>
  );
}
