import { defineConfig } from "@playwright/test";

const config = defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	use: {
		baseURL: "http://localhost:6006",
		trace: "on-first-retry",
		launchOptions: {
			args: [
				"--use-gl=angle",
				"--use-angle=swiftshader",
				"--enable-webgl",
			],
		},
	},
	snapshotPathTemplate:
		"{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}",
	expect: {
		toHaveScreenshot: {
			maxDiffPixelRatio: 0.01,
		},
	},
	webServer: {
		command: "pnpm storybook --ci --port 6006",
		port: 6006,
		reuseExistingServer: !process.env.CI,
	},
});

export default config;
