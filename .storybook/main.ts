import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: [
    "../app/**/*.stories.@(ts|tsx|mdx)",
    "../components/**/*.stories.@(ts|tsx|mdx)",
    "../entities/**/*.stories.@(ts|tsx|mdx)",
    "../features/**/*.stories.@(ts|tsx|mdx)",
    "../widgets/**/*.stories.@(ts|tsx|mdx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],
};
export default config;