export type Project = {
  title: string;
  slug?: string;
  description: string;
  tags?: string[];
  technologies?: string[];
  status?: "In Progress" | "Completed" | "On Hold" | "Abandoned"; // Extend as needed
  urls: {
    repository: string | null;
    production: string | null;
  };
  screenshots?: string;
  features?: string[];
  contributors?: {
      login: string;
      avatar_url: string;
    }[];
  date_started: string; // Could be Date if converted properly
  date_completed?: string;
  challenges?: string[];
  solutions?: string[];
  testimonials?: {
    name: string;
    title: string;
    feedback: string;
  }[];
  related_projects?: string[];
};

export type Command = {
  description: string;
  usage: string;
  options?: Record<string, string>; // maps options like '--verbose' to descriptions
};

export type CommandsMap = Record<string, Command>;

export type CLIOptions = {
  verbose: boolean;
  force: boolean;
};

export type CLICommand = "generate" | "help" | string; // can add for future commands

export type CLIArgs = {
  command: CLICommand;
  params: string[]; // stuff like filepaths
  options: CLIOptions;
};

