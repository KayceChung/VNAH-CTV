
import Link from "next/link";
import dynamic from "next/dynamic";
const PermissionDiagram = dynamic(() => import("@/components/PermissionDiagram"), { ssr: false });

export default function UsageGuidePage() {
  return (
    <main className="app-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <div className="page-fade rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1E40AF]">
                Tài liệu
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                Hướng Dẫn Cài Đặt Và Sử Dụng Ứng Dụng QLNKT
              </h1>
            </div>
            <Link
              href="/"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Quay về trang chủ
            </Link>
          </div>
        </div>

        <section className="page-fade rounded-3xl border border-slate-200/80 bg-white/80 p-3 shadow-sm backdrop-blur sm:p-4">
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 0,
              paddingTop: "100%",
              paddingBottom: 0,
              boxShadow: "0 2px 8px 0 rgba(63,69,81,0.16)",
              marginTop: "1.6em",
              marginBottom: "0.9em",
              overflow: "hidden",
              borderRadius: "8px",
              willChange: "transform",
            }}
          >
            <iframe
              loading="lazy"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                border: "none",
                padding: 0,
                margin: 0,
              }}
              src="https://www.canva.com/design/DAHJtWq4Jx8/842JEZEpH5pfvgCpqhqf_g/view?embed"
              allowFullScreen
              allow="fullscreen"
              title="Hướng dẫn cài đặt và sử dụng ứng dụng QLNKT"
            />
          </div>

          <a
            href="https://www.canva.com/design/DAHJtWq4Jx8/842JEZEpH5pfvgCpqhqf_g/view?utm_content=DAHJtWq4Jx8&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-medium text-[#1E40AF] underline-offset-2 hover:underline"
          >
            HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG ỨNG DỤNG QLNKT - 1
          </a>
          <span className="ml-1 text-sm text-slate-600">của Hien Khang Chung</span>
        </section>

        {/* Sơ đồ phân quyền theo cấp độ */}
        <section className="page-fade rounded-3xl border border-slate-200/80 bg-white/80 p-3 shadow-sm backdrop-blur sm:p-4 mt-6">
          <PermissionDiagram />
        </section>
      </div>
    </main>
  );
}
