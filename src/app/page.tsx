"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  appPromise,
  clientScenarios,
  defaultNotes,
  discoveryAxes,
  trainingSteps,
  type SessionNotes,
} from "@/lib/training-data";

type View = "home" | "notes" | "commercial" | "client";

type AppState = {
  view: View;
  selectedCaseId: string;
  stepIndex: number;
  stepChecks: Record<string, boolean[]>;
  discoveryChecks: Record<string, Record<string, boolean[]>>;
  stepNotes: Record<string, string>;
  notes: SessionNotes;
};

const storageKey = "septeo-avocat-closing-lab-v1";

const initialState = (): AppState => ({
  view: "home",
  selectedCaseId: "",
  stepIndex: 0,
  stepChecks: {},
  discoveryChecks: {},
  stepNotes: {},
  notes: defaultNotes,
});

function coerceState(value: unknown): AppState {
  if (!value || typeof value !== "object") return initialState();
  const partial = value as Partial<AppState>;

  return {
    ...initialState(),
    ...partial,
    notes: {
      ...defaultNotes,
      ...(partial.notes || {}),
    },
    view: partial.view || "home",
    selectedCaseId: partial.selectedCaseId || "",
    stepIndex:
      typeof partial.stepIndex === "number" ? partial.stepIndex : 0,
    stepChecks: partial.stepChecks || {},
    discoveryChecks: partial.discoveryChecks || {},
    stepNotes: partial.stepNotes || {},
  };
}

function TextAreaField({
  id,
  label,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field-block" htmlFor={id}>
      <span>{label}</span>
      <textarea
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export default function Home() {
  const [state, setState] = useState<AppState>(() => initialState());
  const [isHydrated, setIsHydrated] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        setState(coerceState(JSON.parse(raw)));
      }
    } catch {
      setState(initialState());
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [isHydrated, state]);

  const selectedScenario = useMemo(
    () =>
      clientScenarios.find((scenario) => scenario.id === state.selectedCaseId),
    [state.selectedCaseId],
  );

  const currentStep = trainingSteps[state.stepIndex] || trainingSteps[0];

  function updateState(patch: Partial<AppState>) {
    setState((current) => ({ ...current, ...patch }));
  }

  function openView(view: View) {
    updateState({ view });
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateNote(field: keyof SessionNotes, value: string) {
    setState((current) => ({
      ...current,
      notes: {
        ...current.notes,
        [field]: value,
      },
    }));
  }

  function selectScenario(id: string) {
    const scenario = clientScenarios.find((item) => item.id === id);
    setState((current) => ({
      ...current,
      selectedCaseId: id,
      notes: {
        ...current.notes,
        casePlayed: scenario?.cabinet || current.notes.casePlayed,
        objection: scenario?.objection || current.notes.objection,
      },
    }));
  }

  function toggleStepCheck(stepId: string, index: number) {
    setState((current) => {
      const next = [...(current.stepChecks[stepId] || [])];
      next[index] = !next[index];
      return {
        ...current,
        stepChecks: {
          ...current.stepChecks,
          [stepId]: next,
        },
      };
    });
  }

  function toggleDiscoveryCheck(axisId: string, index: number) {
    setState((current) => {
      const stepId = "decouverte";
      const axisChecks = current.discoveryChecks[stepId]?.[axisId] || [];
      const nextAxisChecks = [...axisChecks];
      nextAxisChecks[index] = !nextAxisChecks[index];
      return {
        ...current,
        discoveryChecks: {
          ...current.discoveryChecks,
          [stepId]: {
            ...(current.discoveryChecks[stepId] || {}),
            [axisId]: nextAxisChecks,
          },
        },
      };
    });
  }

  function updateStepNote(stepId: string, value: string) {
    setState((current) => ({
      ...current,
      stepNotes: {
        ...current.stepNotes,
        [stepId]: value,
      },
    }));
  }

  function moveStep(direction: -1 | 1) {
    setState((current) => ({
      ...current,
      stepIndex: Math.min(
        Math.max(current.stepIndex + direction, 0),
        trainingSteps.length - 1,
      ),
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetSession() {
    const next = initialState();
    setState(next);
    window.localStorage.removeItem(storageKey);
    setNotice("Session reinitialisee.");
  }

  function buildTextExport() {
    const scenario = selectedScenario;
    const stepNotes = trainingSteps
      .map((step) => {
        const note = state.stepNotes[step.id];
        if (!note) return "";
        return `- ${step.title}: ${note}`;
      })
      .filter(Boolean)
      .join("\n");

    return [
      "Formation Septeo Avocat - Closing",
      `Export du ${new Date().toLocaleString("fr-FR")}`,
      "",
      `Cas joue : ${state.notes.casePlayed || scenario?.cabinet || "Non renseigne"}`,
      `Interlocuteur : ${scenario?.interlocutor || "Non renseigne"}`,
      "",
      "Enjeux reperes",
      state.notes.detectedIssues || "Non renseigne",
      "",
      "Consequences verbalisees",
      state.notes.voicedConsequences || "Non renseigne",
      "",
      "Solution pertinente",
      state.notes.relevantSolution || "Non renseigne",
      "",
      "Objection rencontree",
      state.notes.objection || "Non renseigne",
      "",
      "Closing tente",
      state.notes.closingAttempt || "Non renseigne",
      "",
      "Resultat",
      state.notes.result || "Non renseigne",
      "",
      "Notes de debrief",
      state.notes.debrief || "Non renseigne",
      "",
      "Notes par etape",
      stepNotes || "Non renseigne",
    ].join("\n");
  }

  function downloadFile(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setNotice(`Export cree : ${filename}`);
  }

  function exportTxt() {
    downloadFile(
      "formation-septeo-avocat-closing.txt",
      buildTextExport(),
      "text/plain;charset=utf-8",
    );
  }

  function exportJson() {
    downloadFile(
      "formation-septeo-avocat-closing.json",
      JSON.stringify(
        {
          label: "Formation Septeo Avocat - Closing",
          exportedAt: new Date().toISOString(),
          selectedScenario,
          notes: state.notes,
          stepNotes: state.stepNotes,
          stepChecks: state.stepChecks,
          discoveryChecks: state.discoveryChecks,
        },
        null,
        2,
      ),
      "application/json;charset=utf-8",
    );
  }

  const completedChecks = Object.values(state.stepChecks).reduce(
    (total, checks) => total + checks.filter(Boolean).length,
    0,
  );

  return (
    <main className="app-shell">
      <header className="top-bar">
        <button
          className="brand-button"
          type="button"
          onClick={() => openView("home")}
          aria-label="Retour a l'accueil"
        >
          <Image
            src="/brand/septeo-logo.jpg"
            alt="Septeo"
            width={210}
            height={86}
            priority
          />
        </button>
        <div className="top-bar-copy">
          <strong>Avocat Closing Lab</strong>
          <span>{appPromise}</span>
        </div>
        <button className="reset-button" type="button" onClick={resetSession}>
          Reinitialiser
        </button>
      </header>

      {notice ? <div className="notice">{notice}</div> : null}

      <nav className="module-tabs" aria-label="Modules de l'application">
        {[
          ["home", "Accueil"],
          ["notes", "Prise de notes"],
          ["commercial", "Commercial"],
          ["client", "Client"],
        ].map(([view, label]) => (
          <button
            key={view}
            type="button"
            className={state.view === view ? "is-active" : ""}
            onClick={() => openView(view as View)}
          >
            {label}
          </button>
        ))}
      </nav>

      {state.view === "home" ? (
        <section className="home-grid">
          <div className="intro-panel">
            <Image
              src="/brand/septeo-logo.jpg"
              alt="Septeo"
              width={320}
              height={131}
              priority
            />
            <p className="eyebrow">Session terrain · 3 heures</p>
            <h1>Structurer l&apos;entretien pour closer proprement.</h1>
            <p>
              Le closing devient naturel quand l&apos;avocat a reconnu ses enjeux,
              mesure leurs consequences et voit clairement l&apos;utilite de la
              solution Septeo.
            </p>
            <div className="status-strip">
              <span>Cas : {selectedScenario?.cabinet || "aucun"}</span>
              <span>Etape : {currentStep.shortLabel}</span>
              <span>Validations : {completedChecks}</span>
            </div>
          </div>

          <div className="action-grid">
            <button type="button" onClick={() => openView("notes")}>
              <span>01</span>
              <strong>Prise de notes</strong>
              <small>Enjeux, consequences, objection, closing et debrief.</small>
            </button>
            <button type="button" onClick={() => openView("commercial")}>
              <span>02</span>
              <strong>Commercial</strong>
              <small>GPS d&apos;entretien en 10 etapes, jusqu&apos;au closing.</small>
            </button>
            <button type="button" onClick={() => openView("client")}>
              <span>03</span>
              <strong>Client</strong>
              <small>Cas avocats prets a jouer en binome.</small>
            </button>
          </div>
        </section>
      ) : null}

      {state.view === "notes" ? (
        <section className="workspace">
          <div className="section-head">
            <p className="eyebrow">Module 01</p>
            <h2>Prise de notes</h2>
            <p>
              Gardez uniquement la matiere utile au debrief : enjeux exprimes,
              consequences, solution, objection et niveau de closing.
            </p>
          </div>

          <div className="notes-grid">
            <label className="field-block" htmlFor="case-played">
              <span>Cas joue</span>
              <input
                id="case-played"
                value={state.notes.casePlayed}
                placeholder="Ex. Durand & Associes"
                onChange={(event) =>
                  updateNote("casePlayed", event.target.value)
                }
              />
            </label>
            <TextAreaField
              id="detected-issues"
              label="Enjeux reperes"
              value={state.notes.detectedIssues}
              placeholder="Ex. charge documentaire, facturation tardive, clients qui relancent..."
              onChange={(value) => updateNote("detectedIssues", value)}
            />
            <TextAreaField
              id="voiced-consequences"
              label="Consequences verbalisees"
              value={state.notes.voicedConsequences}
              placeholder="Ce que le client a reconnu lui-meme."
              onChange={(value) => updateNote("voicedConsequences", value)}
            />
            <TextAreaField
              id="relevant-solution"
              label="Solution pertinente"
              value={state.notes.relevantSolution}
              placeholder="Ex. Septeo Brain, Secib Online, Meet Law, pilotage..."
              onChange={(value) => updateNote("relevantSolution", value)}
            />
            <TextAreaField
              id="objection"
              label="Objection rencontree"
              value={state.notes.objection}
              placeholder="Budget, besoin de reflechir, priorite, confidentialite..."
              onChange={(value) => updateNote("objection", value)}
            />
            <TextAreaField
              id="closing-attempt"
              label="Closing tente"
              value={state.notes.closingAttempt}
              placeholder="Formulation exacte ou intention de closing."
              onChange={(value) => updateNote("closingAttempt", value)}
            />
            <TextAreaField
              id="result"
              label="Resultat"
              value={state.notes.result}
              placeholder="Avancee acceptee, rappel prevu, refus maintenu..."
              onChange={(value) => updateNote("result", value)}
            />
            <TextAreaField
              id="debrief"
              label="Notes de debrief"
              value={state.notes.debrief}
              placeholder="Ce qui a aide, ce qui doit etre rejoue, prochaine consigne."
              onChange={(value) => updateNote("debrief", value)}
            />
          </div>

          <div className="button-row">
            <button type="button" onClick={exportTxt}>
              Export .txt
            </button>
            <button type="button" onClick={exportJson}>
              Export .json
            </button>
            <button type="button" className="secondary" onClick={resetSession}>
              Effacer
            </button>
          </div>
        </section>
      ) : null}

      {state.view === "commercial" ? (
        <section className="workspace commercial-layout">
          <aside className="step-list" aria-label="Etapes commerciales">
            {trainingSteps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                className={state.stepIndex === index ? "is-active" : ""}
                onClick={() => updateState({ stepIndex: index })}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {step.shortLabel}
              </button>
            ))}
          </aside>

          <article className="step-panel">
            <div className="step-kicker">
              Etape {state.stepIndex + 1} / {trainingSteps.length}
            </div>
            <h2>{currentStep.title}</h2>
            <p className="lead">{currentStep.objective}</p>

            <div className="content-columns">
              <section>
                <h3>Formulations utiles</h3>
                <ul className="script-list">
                  {currentStep.formulations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Points de vigilance</h3>
                <ul className="script-list warning">
                  {currentStep.watchouts.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>

            {currentStep.id === "decouverte" ? (
              <section className="discovery-zone">
                <h3>Axes de mini-decouverte Septeo</h3>
                <div className="axis-grid">
                  {discoveryAxes.map((axis) => (
                    <article key={axis.id} className="axis-card">
                      <strong>{axis.title}</strong>
                      <p>{axis.intent}</p>
                      {axis.questions.map((question, index) => (
                        <label key={question} className="check-line">
                          <input
                            type="checkbox"
                            checked={Boolean(
                              state.discoveryChecks.decouverte?.[axis.id]?.[
                                index
                              ],
                            )}
                            onChange={() =>
                              toggleDiscoveryCheck(axis.id, index)
                            }
                          />
                          <span>{question}</span>
                        </label>
                      ))}
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {currentStep.id === "objection" ? (
              <section className="script-box">
                <h3>Objection a faire jouer</h3>
                <p>
                  &quot;C&apos;est interessant, mais ca represente quand meme un
                  budget. J&apos;ai besoin d&apos;y reflechir.&quot;
                </p>
                <ol>
                  <li>Accueillir : budget legitime.</li>
                  <li>Isoler : hormis le budget, autre frein ?</li>
                  <li>Revenir aux enjeux et consequences.</li>
                  <li>Reengager vers une avancee.</li>
                </ol>
              </section>
            ) : null}

            {currentStep.id === "closing" ? (
              <section className="script-box">
                <h3>Closing de reengagement</h3>
                <p>
                  &quot;J&apos;ai plutot le sentiment que l&apos;essentiel est
                  clarifie. Vous m&apos;avez dit que vous aviez tel enjeu, avec
                  telle consequence, et que cette solution repondait bien au
                  sujet. Pour moi, le vrai sujet maintenant, c&apos;est
                  d&apos;avancer. Le 8, c&apos;est bon pour vous ?&quot;
                </p>
              </section>
            ) : null}

            <section className="checklist-block">
              <h3>Checklist</h3>
              {currentStep.checklist.map((item, index) => (
                <label key={item} className="check-line">
                  <input
                    type="checkbox"
                    checked={Boolean(state.stepChecks[currentStep.id]?.[index])}
                    onChange={() => toggleStepCheck(currentStep.id, index)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </section>

            <label className="field-block step-note" htmlFor="step-note">
              <span>Note rapide sur cette etape</span>
              <textarea
                id="step-note"
                value={state.stepNotes[currentStep.id] || ""}
                placeholder="Verbatim client, angle a creuser, formulation a rejouer..."
                onChange={(event) =>
                  updateStepNote(currentStep.id, event.target.value)
                }
              />
            </label>

            <div className="button-row">
              <button
                type="button"
                className="secondary"
                onClick={() => moveStep(-1)}
                disabled={state.stepIndex === 0}
              >
                Etape precedente
              </button>
              <button
                type="button"
                onClick={() => moveStep(1)}
                disabled={state.stepIndex === trainingSteps.length - 1}
              >
                Etape suivante
              </button>
              <button type="button" onClick={() => openView("notes")}>
                Noter le debrief
              </button>
            </div>
          </article>
        </section>
      ) : null}

      {state.view === "client" ? (
        <section className="workspace">
          <div className="section-head">
            <p className="eyebrow">Module 03</p>
            <h2>Cas client avocat</h2>
            <p>
              Le joueur client lit le cas, donne les informations spontanees,
              puis ne revele les signaux caches que si les questions sont
              bonnes.
            </p>
          </div>

          <div className="scenario-grid">
            {clientScenarios.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                className={
                  state.selectedCaseId === scenario.id
                    ? "scenario-card is-active"
                    : "scenario-card"
                }
                onClick={() => selectScenario(scenario.id)}
              >
                <span>{scenario.title}</span>
                <strong>{scenario.cabinet}</strong>
                <small>{scenario.dominantIssue}</small>
              </button>
            ))}
          </div>

          {selectedScenario ? (
            <article className="scenario-detail">
              <div className="scenario-heading">
                <div>
                  <p className="eyebrow">Cas selectionne</p>
                  <h2>{selectedScenario.cabinet}</h2>
                  <p>
                    {selectedScenario.size} · {selectedScenario.interlocutor}
                  </p>
                </div>
                <button type="button" onClick={() => openView("commercial")}>
                  Lancer le role commercial
                </button>
              </div>

              <div className="detail-grid">
                <section>
                  <h3>Contexte</h3>
                  <ul>
                    {selectedScenario.context.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>Irritants visibles</h3>
                  <ul>
                    {selectedScenario.visibleIrritants.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>Consequences</h3>
                  <ul>
                    {selectedScenario.consequences.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>Ce que je dis spontanement</h3>
                  <ul>
                    {selectedScenario.spontaneousLines.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>Signaux caches</h3>
                  <ul>
                    {selectedScenario.hiddenSignals.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>Objection et closing</h3>
                  <p className="quote">{selectedScenario.objection}</p>
                  <p>{selectedScenario.expectedClosingReaction}</p>
                </section>
              </div>

              <section className="response-bank">
                <h3>Banque de reponses rapides</h3>
                <div>
                  {selectedScenario.responseBank.map((item) => (
                    <article key={item.commercialQuestion}>
                      <strong>{item.commercialQuestion}</strong>
                      <p>{item.clientAnswer}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="solutions-strip">
                <h3>Solutions Septeo pertinentes</h3>
                {selectedScenario.relevantSolutions.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </section>
            </article>
          ) : (
            <div className="empty-state">
              Choisissez un cas pour afficher la fiche client complete.
            </div>
          )}
        </section>
      ) : null}
    </main>
  );
}
