import { HTMLAttributes, ReactNode } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Container({ className = "", children, ...props }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 md:px-10 ${className}`} {...props}>
      {children}
    </div>
  );
}
