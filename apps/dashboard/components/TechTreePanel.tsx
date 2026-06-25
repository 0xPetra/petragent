'use client'

import { useMemo, useState } from 'react'
import type { Run, Skill } from '../lib/types'
import { cronLabel, displayName, getSkillStatus, inputCls, statusDot, timeAgo } from '../lib/utils'

type Depth = 'shallow' | 'deep'

interface TechTreePanelProps {
  skill: Skill | null
  runs: Run[]
  busy: boolean
  onRun: (domain: string, depth: Depth, nodes: number) => void
  onSelectSkill: (name: string) => void
  onViewRun: (run: Run) => void
}

function clampNodes(value: number): number {
  return Math.max(1, Math.min(24, Number.isFinite(value) ? value : 12))
}

export function TechTreePanel({ skill, runs, busy, onRun, onSelectSkill, onViewRun }: TechTreePanelProps) {
  const initialDomain = (skill?.var || 'AI agents').replace(/\s+--.*/, '').trim() || 'AI agents'
  const [domain, setDomain] = useState(initialDomain)
  const [depth, setDepth] = useState<Depth>('deep')
  const [nodes, setNodes] = useState(12)

  const cleanDomain = domain.trim().replace(/\s+/g, ' ')
  const nodeCap = clampNodes(nodes)
  const canRun = !!skill && !!cleanDomain && !busy
  const st = skill ? getSkillStatus(skill.name, skill.enabled, runs) : null
  const techRuns = runs.filter(r => r.workflow.toLowerCase().includes('tech-tree')).slice(0, 5)
  const brief = useMemo(
    () => cleanDomain ? `${cleanDomain} --depth=${depth} --nodes=${nodeCap}` : '',
    [cleanDomain, depth, nodeCap],
  )

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-10">
      <section className="relative overflow-hidden border border-[rgba(250,250,250,0.10)] bg-aeon-panel">
        <div className="dither" aria-hidden="true" />
        <div className="relative z-10 px-8 pt-10 pb-8">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-aeon-red inline-flex items-center gap-3">
              <span className="w-7 h-px bg-aeon-red" />
              Research & Content
            </span>
            {st && (
              <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-primary-50">
                <span className={statusDot(st.color)} />
                {st.label}
              </span>
            )}
          </div>
          <h1 className="font-display uppercase leading-[0.92] tracking-tight text-aeon-fg" style={{ fontSize: 'clamp(40px, 6vw, 82px)' }}>
            Tech Tree
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-primary-70 leading-relaxed">
            Map a domain into an Obsidian vault with wikilinked research nodes, prediction-market odds, and draft Precog market proposals.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-px bg-[rgba(250,250,250,0.10)] border border-[rgba(250,250,250,0.10)]">
        <div className="bg-aeon-bg p-6 space-y-6">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[0.18em] text-primary-40 mb-2">Domain</label>
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && canRun) onRun(cleanDomain, depth, nodeCap) }}
              placeholder="AI agents"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-primary-40 mb-2">Depth</div>
              <div className="grid grid-cols-2 border border-[rgba(250,250,250,0.10)]">
                {(['shallow', 'deep'] as const).map(option => (
                  <button
                    key={option}
                    onClick={() => setDepth(option)}
                    className={`h-11 text-[11px] font-mono uppercase tracking-[0.16em] transition-colors ${depth === option ? 'bg-aeon-fg text-aeon-bg' : 'bg-aeon-panel text-primary-50 hover:text-primary-100'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-primary-40 mb-2">Node cap</div>
              <div className="flex border border-[rgba(250,250,250,0.10)] h-11">
                <button
                  onClick={() => setNodes(n => clampNodes(n - 1))}
                  className="w-11 bg-aeon-panel text-primary-50 hover:text-primary-100 transition-colors"
                  aria-label="Decrease node cap"
                >
                  -
                </button>
                <input
                  value={nodeCap}
                  type="number"
                  min={1}
                  max={24}
                  onChange={(e) => setNodes(clampNodes(parseInt(e.target.value, 10)))}
                  className="flex-1 min-w-0 bg-aeon-bg text-aeon-fg text-sm text-center font-mono outline-none border-x border-[rgba(250,250,250,0.10)]"
                />
                <button
                  onClick={() => setNodes(n => clampNodes(n + 1))}
                  className="w-11 bg-aeon-panel text-primary-50 hover:text-primary-100 transition-colors"
                  aria-label="Increase node cap"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="border border-[rgba(250,250,250,0.10)] bg-aeon-panel px-4 py-3">
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-primary-35 mb-1">Dispatch var</div>
            <div className="font-mono text-xs text-primary-80 break-words">{brief || '-'}</div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onRun(cleanDomain, depth, nodeCap)}
              disabled={!canRun}
              className="btn-solid disabled:opacity-50"
              style={{ background: 'var(--aeon-red)', borderColor: 'var(--aeon-red)', color: 'var(--aeon-fg-pure)' }}
            >
              {busy ? 'Starting...' : 'Run Tech Tree'}
            </button>
            {skill && (
              <button
                onClick={() => onSelectSkill(skill.name)}
                className="btn-ghost"
              >
                Open Skill
              </button>
            )}
          </div>
        </div>

        <aside className="bg-aeon-bg p-6 border-t lg:border-t-0 lg:border-l border-[rgba(250,250,250,0.10)] space-y-5">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-primary-40 mb-2">Skill</div>
            <div className="font-display uppercase tracking-wide text-aeon-fg text-lg">{skill ? displayName(skill.name) : 'Not installed'}</div>
            <div className="text-[11px] text-primary-40 font-mono mt-1 uppercase tracking-[0.14em]">
              {skill ? cronLabel(skill.schedule) : 'Missing'}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-primary-40 mb-2">Recent runs</div>
            <div className="border border-[rgba(250,250,250,0.10)] divide-y divide-[rgba(250,250,250,0.08)]">
              {techRuns.map(run => (
                <button
                  key={run.id}
                  onClick={() => onViewRun(run)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-aeon-panel transition-colors"
                >
                  <span className={`text-sm w-4 shrink-0 ${run.conclusion === 'success' ? 'text-eva-green' : run.conclusion === 'failure' ? 'text-eva-red' : run.status === 'in_progress' ? 'text-eva-orange' : 'text-primary-35'}`}>
                    {run.conclusion === 'success' ? 'ok' : run.conclusion === 'failure' ? 'x' : run.status === 'in_progress' ? 'o' : '-'}
                  </span>
                  <span className="text-[11px] text-primary-70 font-mono flex-1 truncate">{run.status}</span>
                  <span className="text-[10px] text-primary-35 font-mono shrink-0">{timeAgo(run.created_at)}</span>
                </button>
              ))}
              {!techRuns.length && (
                <div className="px-3 py-8 text-center text-[11px] text-primary-40 font-mono uppercase tracking-[0.14em]">
                  No runs yet
                </div>
              )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
