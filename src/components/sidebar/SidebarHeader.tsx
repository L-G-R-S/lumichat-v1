
import { Bot } from "lucide-react";

const SidebarHeader = () => {
  return (
    <div className="flex items-center gap-2 mb-6 px-2">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
        <Bot className="h-5 w-5 text-primary" />
      </div>
      <h1 className="text-xl font-semibold text-foreground">LumiChat</h1>
    </div>
  );
};

export default SidebarHeader;
