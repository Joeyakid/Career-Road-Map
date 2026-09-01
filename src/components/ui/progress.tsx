export function Progress({ value, label }: { value: number; label?: string }) {
  const progress = Math.min(100, Math.max(0, value));
  return <div className="pf-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={label}><span style={{ width: `${progress}%` }}/></div>;
}
