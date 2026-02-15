import type { Preview } from "@storybook/react-vite";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";

const mobileViewports = {
  smartphone: {
    name: "Smart Phone",
    styles: {
      width: "390px",
      height: "844px",
    },
    type: "mobile" as const,
  },
};

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: {
        ...MINIMAL_VIEWPORTS,
        ...mobileViewports,
      },
    },
  },
};

export default preview;
