
import React from 'react';
import { ArrowDown, ArrowRight } from "lucide-react";

interface DirectionalArrowProps {
  isMobile: boolean;
}

export const DirectionalArrow: React.FC<DirectionalArrowProps> = ({ isMobile }) => {
  return (
    <div className="flex justify-center mt-6 mb-4">
      <div className="relative p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
        {isMobile ? (
          <ArrowDown className="w-6 h-6 text-primary animate-float" />
        ) : (
          <ArrowRight className="w-6 h-6 text-primary animate-float" />
        )}
      </div>
    </div>
  );
};
