import { expect, test } from "@playwright/test";

test("mobile simulation flow persists notes and exports JSON", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("/");

  await expect(page.getByText("Avocat Closing Lab")).toBeVisible();
  await expect(page.getByAltText("Septeo").first()).toBeVisible();

  await page
    .locator(".module-tabs")
    .getByRole("button", { name: "Client" })
    .click();
  await page.getByRole("button", { name: /Durand & Associes/ }).click();
  await expect(page.getByText("Cas selectionne")).toBeVisible();
  await expect(page.getByText("Analyse documentaire sous tension")).toBeVisible();

  await page.getByRole("button", { name: /Lancer le role commercial/ }).click();
  await expect(page.getByRole("heading", { name: "Brise-glace" })).toBeVisible();

  for (let step = 0; step < 9; step += 1) {
    await page.getByRole("button", { name: "Etape suivante" }).click();
  }

  await expect(
    page.getByRole("heading", { name: "Closing sobre et assume" }),
  ).toBeVisible();

  await page
    .locator(".module-tabs")
    .getByRole("button", { name: "Prise de notes" })
    .click();
  await page
    .getByLabel("Enjeux reperes")
    .fill("Charge documentaire et confidentialite.");
  await page
    .getByLabel("Consequences verbalisees")
    .fill("Retards, fatigue des collaborateurs et pression qualite.");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export .json" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe(
    "formation-septeo-avocat-closing.json",
  );

  await page.reload();
  await expect(page.getByLabel("Enjeux reperes")).toHaveValue(
    "Charge documentaire et confidentialite.",
  );

  await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
  expect(consoleErrors).toEqual([]);
});
