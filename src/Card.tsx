import type { ReactNode } from "react";

type CardProps = {
  title: string;
  content: ReactNode;
};

/** Renders a titled content card. */
export function Card({ title, content }: CardProps) {
  return (
    <article style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
      <h3>{title}</h3>
      {content}
    </article>
  );
}