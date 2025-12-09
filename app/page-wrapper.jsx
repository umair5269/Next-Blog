import { Suspense } from "react";
import HomePage from "./page-client";

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}
