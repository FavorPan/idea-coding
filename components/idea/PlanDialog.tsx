"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/i18n/client";
import type { BoardProject } from "@/lib/logic/projects";
import { buildStarterPlan, skillBundleMarkdown, skillUseReason, trackById } from "@/lib/logic/projects";

interface PlanDialogProps {
  project: BoardProject;
  onClose: () => void;
}

export function PlanDialog({ project, onClose }: PlanDialogProps) {
  const t = useTranslations("dialog");
  const { locale } = useLocale();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const plan = buildStarterPlan(project, locale);
  const track = trackById(project.track);
  const scalePercent = Math.round((plan.scale.value / 5) * 100);

  // Focus the dialog on open.
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  // Escape to close.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(plan.codexPrompt);
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = plan.codexPrompt;
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.append(fallback);
      fallback.select();
      document.execCommand("copy");
      fallback.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadSkillBundle() {
    const md = skillBundleMarkdown(project, locale);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/[^\w一-龥]+/g, "-").toLowerCase()}-skills.md`;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="plan-dialog-shell">
      <div className="plan-backdrop" onClick={onClose} />
      <section
        className="plan-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="planTitle"
        tabIndex={-1}
        ref={dialogRef}
        style={{ "--track": track?.accent } as React.CSSProperties}
      >
        <header className="plan-dialog-head">
          <div>
            <p className="section-kicker">{t("kicker")}</p>
            <h2 id="planTitle">{project.name}</h2>
            <p>
              {project.tagline} {t("intro")}
            </p>
            <div className="plan-dialog-actions">
              <button type="button" className="copy-plan" onClick={copyPrompt}>
                {copied ? t("copied") : t("copyPrompt")}
              </button>
              <a
                className="plan-header-source"
                href={plan.primaryUrl}
                target="_blank"
                rel="noreferrer"
              >
                {plan.demoUrl ? t("openDemo") : t("openSource")}
              </a>
            </div>
          </div>
          <button
            type="button"
            className="plan-close"
            onClick={onClose}
            aria-label={t("close")}
          >
            ×
          </button>
        </header>

        <div className="plan-diagnosis">
          <section className={`plan-verdict-card plan-verdict-${plan.verdict.tone}`}>
            <span>{t("worthIt")}</span>
            <strong>{plan.verdict.label}</strong>
            <p>{plan.verdict.reason}</p>
          </section>
          <section className="plan-scale-card">
            <div>
              <span>{t("difficulty")}</span>
              <strong>Scale {plan.scale.value}/5</strong>
            </div>
            <div
              className="plan-scale-meter"
              aria-label={t("difficultyAria") + " " + plan.scale.value + "/5"}
            >
              <i style={{ width: `${scalePercent}%` }} />
            </div>
            <p>
              {plan.scale.label}：{plan.scale.hint}
            </p>
          </section>
          <section className="plan-prep-card">
            <span>{t("prep")}</span>
            <div className="plan-prep-list">
              {plan.prepItems.map((item) => (
                <em key={item}>{item}</em>
              ))}
            </div>
          </section>
        </div>

        <div className="plan-grid plan-grid-simple">
          <section className="plan-block plan-demo-block">
            <h3>{t("doFirst")}</h3>
            <p>{project.mvp}</p>
          </section>
          <section className="plan-block plan-risk-block">
            <h3>{t("watchOut")}</h3>
            <ul className="plan-list">
              {plan.risks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </section>
          <a
            className="plan-source-card"
            href={plan.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span>{t("source")}</span>
            <strong>{plan.sourceName}</strong>
            <em>{plan.sourceUrl}</em>
          </a>
          {plan.demoUrl && (
            <a
              className="plan-source-card"
              href={plan.demoUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span>{t("demo")}</span>
              <strong>{t("tryDemo")}</strong>
              <em>{plan.demoUrl}</em>
            </a>
          )}
          <details className="plan-block plan-skill-block">
            <summary>
              <span>{t("skills")}</span>
              <em>{t("skillsExpand")}</em>
            </summary>
            <p>
              {t("skillsNote")}
            </p>
            <div className="plan-skill-list">
              {plan.skills.map((skill) => (
                <a
                  key={skill.id}
                  href={skill.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <strong>{skill.name}</strong>
                  <span>{skillUseReason(project, skill, locale)}</span>
                </a>
              ))}
            </div>
            <button
              type="button"
              className="skill-idea-button"
              data-download-skills
              onClick={downloadSkillBundle}
            >
              {t("downloadSkills")}
            </button>

          </details>
          <section className="plan-block plan-prompt-block">
            <div className="plan-block-head">
              <h3>{t("promptHeading")}</h3>
              <button type="button" className="copy-plan" onClick={copyPrompt}>
                {copied ? t("copied") : t("copyPrompt")}
              </button>
            </div>
            <pre id="planPrompt">{plan.codexPrompt}</pre>
          </section>
        </div>
      </section>
    </div>
  );
}
