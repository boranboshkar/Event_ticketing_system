import { forwardRef, ReactNode } from "react";

interface ForwardRefWrapperProps {
  children: ReactNode;
}

const ForwardRefWrapper = forwardRef<HTMLDivElement, ForwardRefWrapperProps>(
  ({ children }, ref) => {
    return <div ref={ref}>{children}</div>;
  }
);

export default ForwardRefWrapper;
