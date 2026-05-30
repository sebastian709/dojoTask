import { User2 } from "lucide-react";

export default function TaskComments() {
  return (
    <>
      {Array.from({
        length: 20,
      }).map((_, i) => (

        <div
          key={i}
          className="flex gap-3"
        >

          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 flex-shrink-0">

            <User2 size={16} />

          </div>

          <div className="flex-1 rounded-3xl border border-white/10 bg-white/[0.03] p-4">

            <div className="flex items-center justify-between gap-3 mb-2">

              <div className="flex items-center gap-2 flex-wrap">

                <span className="text-sm font-medium text-white">
                  Sebastian
                </span>

                <span className="text-xs text-gray-500">
                  commented
                </span>

              </div>

              <span className="text-[11px] text-gray-600">
                {i + 1}m ago
              </span>

            </div>

            <p className="text-sm leading-relaxed text-gray-300">
              This task needs more polishing before release.
            </p>

          </div>

        </div>

      ))}
    </>
  );
}