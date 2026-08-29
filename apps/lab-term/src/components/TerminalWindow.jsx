/**
 * Desktop terminal chrome — divider (drag or arrow-keys to resize), and
 * minimize/maximize controls (lab-term.md §2.2). Owns none of the sizing
 * logic itself; that's useTerminalSize, passed in from App.jsx so the
 * preview pane above can react to the same numbers.
 */
export default function TerminalWindow({ size, children }) {
  const { state, toggleMinimized, toggleMaximized, dividerHandlers } = size

  return (
    <>
      {state === 'normal' && (
        <div
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize terminal"
          tabIndex={0}
          className="h-1.5 shrink-0 cursor-row-resize touch-none"
          style={{ backgroundColor: 'rgba(148, 163, 184, 0.15)' }}
          {...dividerHandlers}
        />
      )}
      <div
        className="flex shrink-0 flex-col border-t"
        style={{ height: size.resolvedHeight, borderColor: 'rgba(148, 163, 184, 0.15)' }}
      >
        <div
          className="flex h-7 shrink-0 items-center justify-between px-3 font-mono text-[11px]"
          style={{ backgroundColor: 'var(--t-panel)', color: 'var(--t-dim)' }}
        >
          <span>terminal</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={toggleMinimized}
              aria-label={state === 'minimized' ? 'Restore terminal' : 'Minimize terminal'}
              className="flex h-5 w-5 items-center justify-center rounded hover:bg-white/10"
            >
              −
            </button>
            <button
              type="button"
              onClick={toggleMaximized}
              aria-label={state === 'maximized' ? 'Restore terminal' : 'Maximize terminal'}
              className="flex h-5 w-5 items-center justify-center rounded hover:bg-white/10"
            >
              □
            </button>
          </div>
        </div>
        {state !== 'minimized' && <div className="min-h-0 flex-1">{children}</div>}
      </div>
    </>
  )
}
