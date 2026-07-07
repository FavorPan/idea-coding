"use client";

import { useEffect, useRef, useState } from "react";
import type { BoardProject } from "@/lib/logic/projects";
import { buildStarterPlan, skillBundleMarkdown, skillUseReason, trackById } from "@/lib/logic/projects";

interface PlanDialogProps {
  project: BoardProject;
  onClose: () => void;
}

export function PlanDialog({ project, onClose }: PlanDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const plan = buildStarterPlan(project);
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
    const md = skillBundleMarkdown(project);
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
            <p className="section-kicker">Project Checkup</p>
            <h2 id="planTitle">{project.name}</h2>
            <p>
              {project.tagline} 先看它能不能搓，再把提示词交给 AI 开工。
            </p>
            <div className="plan-dialog-actions">
              <button type="button" className="copy-plan" onClick={copyPrompt}>
                {copied ? "已复制" : "复制开工提示词"}
              </button>
              <a
                className="plan-header-source"
                href={plan.primaryUrl}
                target="_blank"
                rel="noreferrer"
              >
                {plan.demoUrl ? "打开演示入口" : "打开项目来源"}
              </a>
            </div>
          </div>
          <button
            type="button"
            className="plan-close"
            onClick={onClose}
            aria-label="关闭开工计划"
          >
            ×
          </button>
        </header>

        <div className="plan-diagnosis">
          <section className={`plan-verdict-card plan-verdict-${plan.verdict.tone}`}>
            <span>值不值得搓</span>
            <strong>{plan.verdict.label}</strong>
            <p>{plan.verdict.reason}</p>
          </section>
          <section className="plan-scale-card">
            <div>
              <span>难不难</span>
              <strong>Scale {plan.scale.value}/5</strong>
            </div>
            <div
              className="plan-scale-meter"
              aria-label={`项目难度 Scale ${plan.scale.value}/5`}
            >
              <i style={{ width: `${scalePercent}%` }} />
            </div>
            <p>
              {plan.scale.label}：{plan.scale.hint}
            </p>
          </section>
          <section className="plan-prep-card">
            <span>先准备什么</span>
            <div className="plan-prep-list">
              {plan.prepItems.map((item) => (
                <em key={item}>{item}</em>
              ))}
            </div>
          </section>
        </div>

        <div className="plan-grid plan-grid-simple">
          <section className="plan-block plan-demo-block">
            <h3>先做这个效果</h3>
            <p>{project.mvp}</p>
          </section>
          <section className="plan-block plan-risk-block">
            <h3>可能会卡在这里</h3>
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
            <span>项目来源</span>
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
              <span>演示入口</span>
              <strong>先看能不能跑出效果</strong>
              <em>{plan.demoUrl}</em>
            </a>
          )}
          <details className="plan-block plan-skill-block">
            <summary>
              <span>用得上的 Skill / 工具</span>
              <em>可选展开</em>
            </summary>
            <p>
              这些不是必须先学的技术栈，只是可以和项目链接一起交给 AI 的参考工具。
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
                  <span>{skillUseReason(project, skill)}</span>
                </a>
              ))}
            </div>
            <button
              type="button"
              className="skill-idea-button"
              data-download-skills
              onClick={downloadSkillBundle}
            >
              下载 Skill 清单 (Markdown)
            </button>

          </details>
          <section className="plan-block plan-prompt-block">
            <div className="plan-block-head">
              <h3>复制给 Codex 的开工提示词</h3>
              <button type="button" className="copy-plan" onClick={copyPrompt}>
                {copied ? "已复制" : "复制提示词"}
              </button>
            </div>
            <pre id="planPrompt">{plan.codexPrompt}</pre>
          </section>
        </div>
      </section>
    </div>
  );
}
