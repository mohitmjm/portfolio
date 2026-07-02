import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const NotFound = () => (
  <>
    <Helmet><title>404 — Signal Lost | Mohit Mohatkar</title></Helmet>
    <div className="min-h-screen grid place-items-center p-6">
      <div className="hud-panel-strong p-10 text-center max-w-md">
        <div className="font-hud text-[10px] tracking-[0.3em] text-cyan mb-3">// TRANSMISSION LOST</div>
        <h1 className="text-6xl font-semibold text-gradient mb-3">404</h1>
        <p className="text-muted-foreground mb-6">This coordinate is not on the grid.</p>
        <Link to="/" className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-gradient-text text-primary-foreground font-hud text-xs tracking-widest hover:shadow-glow">
          RETURN TO CORE
        </Link>
      </div>
    </div>
  </>
);

export default NotFound;
