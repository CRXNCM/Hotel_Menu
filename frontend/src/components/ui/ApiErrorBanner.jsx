const ApiErrorBanner = ({
  title = "Something went wrong",
  message,
  detail,
  onDismiss,
  className = "",
}) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`rounded-2xl border border-rose-400/35 bg-rose-950/45 px-4 py-3 text-rose-50 shadow-lg shadow-black/20 backdrop-blur-sm ${className}`}
    >
      <div className="flex gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-semibold text-rose-100">{title}</p>
          <p className="text-sm leading-relaxed text-rose-100/90">{message}</p>
          {detail ? (
            <details className="pt-1 text-xs text-rose-200/80">
              <summary className="cursor-pointer select-none hover:text-rose-100">Technical details</summary>
              <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-black/30 p-2 font-mono text-[11px] leading-relaxed text-rose-100/85">
                {detail}
              </pre>
            </details>
          ) : null}
        </div>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="h-9 shrink-0 rounded-lg border border-rose-400/30 bg-black/20 px-2 text-lg leading-none text-rose-100 transition hover:bg-black/35"
            aria-label="Dismiss"
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ApiErrorBanner;
