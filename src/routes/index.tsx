import { createFileRoute } from "@tanstack/react-router";
import WinHello from "@/Win-Hello";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <WinHello name="dotpmm" />;
}
