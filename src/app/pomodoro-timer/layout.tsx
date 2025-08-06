import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pomodoro Timer - Track Your Tasks and Productivity",
  description: "Track your tasks and boost productivity with a customizable Pomodoro timer. Create, save, and analyze your progress with beautiful charts.",
  openGraph: {
    title: "Pomodoro Timer - Track Your Tasks and Productivity",
    description: "Track your tasks and boost productivity with a customizable Pomodoro timer. Create, save, and analyze your progress with beautiful charts.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
