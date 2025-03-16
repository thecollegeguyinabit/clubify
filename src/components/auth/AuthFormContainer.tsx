
import React, { ReactNode } from "react";

type AuthFormContainerProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

const AuthFormContainer = ({ title, description, children, footer }: AuthFormContainerProps) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
        <div className="glass-card rounded-lg p-8 shadow-sm">
          {children}
        </div>
        {footer && (
          <div className="mt-6 text-center text-sm">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthFormContainer;
