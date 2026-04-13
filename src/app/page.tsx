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
  activeDiscoveryAxisId: string;
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
  activeDiscoveryAxisId: "",
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
      typeof partial.stepIndex === "number" &&
      partial.stepIndex >= -1 &&
      partial.stepIndex < trainingSteps.length
        ? partial.stepIndex
        : 0,
    activeDiscoveryAxisId: partial.activeDiscoveryAxisId || "",
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

  const currentStep = trainingSteps[state.stepIndex];

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
    setState((current) => {
      if (current.selectedCaseId === id) {
        return {
          ...current,
          selectedCaseId: "",
        };
      }

      return {
        ...current,
        selectedCaseId: id,
        notes: {
          ...current.notes,
          casePlayed: scenario?.cabinet || current.notes.casePlayed,
          objection: scenario?.objection || current.notes.objection,
        },
      };
    });
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

  function selectTrainingStep(index: number) {
    setState((current) => {
      const nextStepIndex = current.stepIndex === index ? -1 : index;

      return {
        ...current,
        stepIndex: nextStepIndex,
        activeDiscoveryAxisId:
          trainingSteps[nextStepIndex]?.id === "decouverte"
            ? current.activeDiscoveryAxisId
            : "",
      };
    });
  }

  function toggleDiscoveryAxis(axisId: string) {
    setState((current) => ({
      ...current,
      activeDiscoveryAxisId:
        current.activeDiscoveryAxisId === axisId ? "" : axisId,
    }));
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
              <span>Etape : {currentStep?.shortLabel || "aucune"}</span>
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
        <section className="workspace commercial-workspace">
          <div className="section-head compact-head">
            <p className="eyebrow">Module 02</p>
            <h2>Structure de l&apos;entretien</h2>
            <p>Ouvrez une carte. Lisez la formulation. Jouez-la.</p>
          </div>

          <div className="commercial-accordion">
            {trainingSteps.map((step, index) => (
              <article
                key={step.id}
                className={
                  state.stepIndex === index
                    ? "step-card is-open"
                    : "step-card"
                }
              >
                <button
                  type="button"
                  className="step-card-button"
                  aria-expanded={state.stepIndex === index}
                  onClick={() => selectTrainingStep(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{step.shortLabel}</strong>
                  <small>{step.title}</small>
                </button>

                {state.stepIndex === index ? (
                  <div className="step-card-body">
                    {step.id === "decouverte" ? (
                      <>
                        <div className="opening-question">
                          <strong>Question d&apos;ouverture</strong>
                          <p>
                            Parlez-moi de votre cabinet et de votre actualite.
                          </p>
                        </div>

                        <div className="theme-stack">
                          {discoveryAxes.map((axis) => {
                            const isAxisOpen =
                              state.activeDiscoveryAxisId === axis.id;

                            return (
                              <article
                                key={axis.id}
                                className={
                                  isAxisOpen
                                    ? "theme-card is-open"
                                    : "theme-card"
                                }
                              >
                                <button
                                  type="button"
                                  aria-expanded={isAxisOpen}
                                  onClick={() => toggleDiscoveryAxis(axis.id)}
                                >
                                  <strong>{axis.title}</strong>
                                  <span>{isAxisOpen ? "Fermer" : "Ouvrir"}</span>
                                </button>

                                {isAxisOpen ? (
                                  <div className="theme-questions">
                                    {axis.questions.map((question, questionIndex) => (
                                      <label
                                        key={question}
                                        className="question-row"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={Boolean(
                                            state.discoveryChecks.decouverte?.[
                                              axis.id
                                            ]?.[questionIndex],
                                          )}
                                          onChange={() =>
                                            toggleDiscoveryCheck(
                                              axis.id,
                                              questionIndex,
                                            )
                                          }
                                        />
                                        <span>{question}</span>
                                      </label>
                                    ))}
                                  </div>
                                ) : null}
                              </article>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="quick-script">
                        {step.formulations.map((item) => (
                          <p key={item}>{item}</p>
                        ))}
                      </div>
                    )}

                    <section className="checklist-block compact-checklist">
                      <h3>A verifier</h3>
                      {step.checklist.map((item, checklistIndex) => (
                        <label key={item} className="check-line">
                          <input
                            type="checkbox"
                            checked={Boolean(
                              state.stepChecks[step.id]?.[checklistIndex],
                            )}
                            onChange={() =>
                              toggleStepCheck(step.id, checklistIndex)
                            }
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </section>

                    <label
                      className="field-block step-note"
                      htmlFor={`step-note-${step.id}`}
                    >
                      <span>Note rapide</span>
                      <textarea
                        id={`step-note-${step.id}`}
                        value={state.stepNotes[step.id] || ""}
                        placeholder="Verbatim client, formulation a rejouer, angle a creuser..."
                        onChange={(event) =>
                          updateStepNote(step.id, event.target.value)
                        }
                      />
                    </label>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
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
                aria-expanded={state.selectedCaseId === scenario.id}
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
