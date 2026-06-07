import { Loader2 } from "lucide-react";

function LoaderPage() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center mx-auto">
      <Loader2 className="h-12 w-12 animate-spin"></Loader2>
    </div>
  );
}

export default LoaderPage;