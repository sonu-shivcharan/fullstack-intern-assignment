import { Loader2 } from "lucide-react";

export function Loader({ className }: { className?: string }) {
  return <Loader2 className={`h-12 w-12 animate-spin ${className}`}></Loader2>;
}
function LoaderPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full items-center justify-center">
      <Loader />
    </div>
  );
}

export default LoaderPage;
