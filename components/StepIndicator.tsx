const steps = [
  { id: 1, title: "Xác thực" },
  { id: 2, title: "Điều chỉnh" },
  { id: 3, title: "Hoàn tất" },
];

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="glass-card rounded-[28px] p-4">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const active = currentStep >= step.id;

          return (
            <div key={step.id} className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition ${
                    active ? "bg-[#1E40AF] text-white" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {step.id}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] uppercase tracking-[0.2em] text-slate-500">Bước</p>
                  <p className="truncate text-sm font-semibold text-slate-900">{step.title}</p>
                </div>
              </div>
              {index < steps.length - 1 ? (
                <div className={`hidden h-1 flex-1 rounded-full sm:block ${active ? "bg-[#93C5FD]" : "bg-slate-200"}`} />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}