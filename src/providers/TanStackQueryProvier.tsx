"use client";

import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const qc = new QueryClient();

export default function TanStackQueryProvider({ children }: PropsWithChildren) {
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
