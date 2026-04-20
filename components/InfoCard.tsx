export function InfoCard({
  title,
  items,
  badge = "Read only",
}: {
  title: string;
  items: Array<{ label: string; value: string }>;
  badge?: string;
}) {
  return (
    <section className="glass-card rounded-[28px] p-6 page-fade">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Ho so nhan su</p>
          <h2 className="text-xl font-bold text-slate-950">{title}</h2>
        </div>
        <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-[#1E40AF]">{badge}</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-900">{item.value || "Chua cap nhat"}</p>
          </div>
        ))}
      </div>
    </section>
  );
}