export default function Loading() {
  return (
    <main className="bg-black text-white min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto px-6 mt-10 grid md:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          <div className="h-[420px] bg-gray-800 rounded-lg"></div>
          <div className="h-10 bg-gray-800 w-3/4 rounded"></div>
          <div className="h-6 bg-gray-800 w-1/2 rounded"></div>

          <div className="grid grid-cols-3 gap-6 mt-6">
            {[1,2,3].map(i=>(
              <div key={i}>
                <div className="h-32 bg-gray-800 rounded mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          {[1,2,3,4,5].map(i=>(
            <div key={i} className="h-6 bg-gray-800 rounded"></div>
          ))}
        </div>

      </div>
    </main>
  );
}