import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`border rounded-lg shadow ${className}`}>{children}</div>
);

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
