export const STATUS_STYLES = {
  Confirmed: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Pending:   "bg-amber-500/15  text-amber-400  border border-amber-500/30",
  Cancelled: "bg-red-500/15    text-red-400    border border-red-500/30",
};
export const STATUS_DOT = {
  Confirmed: "bg-emerald-400",
  Pending:   "bg-amber-400",
  Cancelled: "bg-red-400",
};

export default function Badge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap ${STATUS_STYLES[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[status]}`} />
      {status}
    </span>
  );
}
