import { readFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

type StoryEntry = {
	id: string;
	title: string;
	name: string;
	importPath: string;
	type: string;
};

type StorybookIndex = {
	entries: Record<string, StoryEntry>;
};

const indexPath = resolve(process.cwd(), "storybook-static", "index.json");
const storybookIndex: StorybookIndex = JSON.parse(
	readFileSync(indexPath, "utf-8"),
);

const waitForCanvasRender = async (page: Page) => {
	await page.waitForSelector("canvas", { timeout: 10000 });
	await page.waitForTimeout(2000);
};

const getSnapshotPath = (entry: StoryEntry): string[] => {
	const relative = entry.importPath.replace(/^\.\/src\//, "");
	const dir = dirname(relative);
	const componentFile = basename(relative, ".stories.tsx");
	const componentName = componentFile.toLowerCase();
	const storyName = entry.name.toLowerCase().replace(/\s+/g, "-");
	return [...dir.split("/"), `${componentName}-${storyName}.png`];
};

const isCanvasStory = (importPath: string): boolean =>
	importPath.includes("/scene/");

const TARGET_DIRS = ["ui", "scene"];

const isTargetStory = (importPath: string): boolean =>
	TARGET_DIRS.some((dir) => importPath.startsWith(`./src/${dir}/`));

for (const entry of Object.values(storybookIndex.entries)) {
	if (entry.type !== "story") continue;
	if (!isTargetStory(entry.importPath)) continue;

	test(`${entry.title} > ${entry.name}`, async ({ page }) => {
		await page.goto(`/iframe.html?id=${entry.id}&viewMode=story`);

		if (isCanvasStory(entry.importPath)) {
			await waitForCanvasRender(page);
		} else {
			await page.waitForLoadState("networkidle");
		}

		const screenshotOptions = isCanvasStory(entry.importPath)
			? {
					threshold: 0.3,
					timeout: 10000,
				}
			: undefined;

		await expect(page).toHaveScreenshot(
			getSnapshotPath(entry),
			screenshotOptions,
		);
	});
}
