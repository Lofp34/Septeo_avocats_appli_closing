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
  const durandScenario = page.getByRole("button", {
    name: /Durand & Associes/,
  });
  const priceObjection =
    "C'est interessant, mais ca represente quand meme un budget tres important. Ca me fait hesiter.";
  await durandScenario.click();
  await expect(page.getByText("Cas selectionne")).toBeVisible();
  await expect(page.getByText("Analyse documentaire sous tension")).toBeVisible();
  await expect(durandScenario).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Banque de reponses rapides")).toBeVisible();
  await expect(
    page.getByText(
      "Clairement, la lecture et la synthese des pieces. Ce n'est pas rare que l'equipe y passe des blocs entiers de journee.",
    ),
  ).toBeVisible();
  await expect(page.getByText("Solutions Septeo pertinentes")).toBeVisible();
  await expect(page.getByText(/Septeo Brain pour resumer/)).toBeVisible();
  await expect(
    page.getByText(/Le cabinet traite des dossiers avec beaucoup de pieces/),
  ).toHaveCount(0);

  await page.getByRole("button", { name: /Contexte/ }).click();
  await expect(
    page.getByText(/Le cabinet traite des dossiers avec beaucoup de pieces/),
  ).toBeVisible();

  await page.getByRole("button", { name: /Objection prix et closing/ }).click();
  await expect(
    page.getByText(/Le cabinet traite des dossiers avec beaucoup de pieces/),
  ).toHaveCount(0);
  await expect(page.getByText(priceObjection)).toBeVisible();
  await page.getByRole("button", { name: /Objection prix et closing/ }).click();
  await expect(page.getByText(priceObjection)).toHaveCount(0);

  await durandScenario.click();
  await expect(durandScenario).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByText("Cas selectionne")).toHaveCount(0);
  await expect(
    page.getByText("Choisissez un cas pour afficher la fiche client complete."),
  ).toBeVisible();

  await durandScenario.click();
  await expect(page.getByText("Cas selectionne")).toBeVisible();

  await page.getByRole("button", { name: /Lancer le role commercial/ }).click();
  await expect(page.getByText("Structure de l'entretien")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Contact\s+Brise-glace/ }),
  ).toHaveAttribute("aria-expanded", "true");

  await page.getByRole("button", { name: /Decouverte/ }).click();
  await expect(page.getByText("Question d'ouverture")).toBeVisible();
  await expect(
    page.getByText("Parlez-moi de votre cabinet et de votre actualite."),
  ).toBeVisible();

  await page
    .getByRole("button", { name: /Temps perdu et charge mentale/ })
    .click();
  await expect(
    page.getByText(
      "Aujourd'hui, qu'est-ce qui vous fait perdre le plus de temps au cabinet ?",
    ),
  ).toBeVisible();

  await page.getByRole("button", { name: /Facturation et tresorerie/ }).click();
  await expect(
    page.getByText(
      "Aujourd'hui, qu'est-ce qui vous fait perdre le plus de temps au cabinet ?",
    ),
  ).toHaveCount(0);
  await expect(
    page.getByText(
      "Comment suivez-vous la facturation et les encaissements aujourd'hui ?",
    ),
  ).toBeVisible();

  await page.getByRole("button", { name: /Closing/ }).click();
  await expect(
    page.getByText(
      "Puisque nous sommes d'accord sur les enjeux et sur l'utilite de la solution",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: /Closing/ }).click();
  await expect(page.getByRole("button", { name: /Closing/ })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expect(
    page.getByText(/Puisque nous sommes d'accord sur les enjeux/),
  ).toHaveCount(0);

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
