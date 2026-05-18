import { Suspense } from "react";
import WorkspaceClient from "./WorkspaceClient";

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-background"><span className="animate-pulse text-primary font-mono text-sm tracking-widest">LOADING...</span></div>}>
      <WorkspaceClient />
    </Suspense>
  );
}
