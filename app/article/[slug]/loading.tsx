export default function LoadingArticle() {
  return (
    <main className="bg-black text-white min-h-screen animate-pulse">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">

        <div className="h-6 bg-gray-800 w-24 rounded"></div>
        <div className="h-12 bg-gray-800 w-3/4 rounded"></div>
        <div className="h-6 bg-gray-800 w-1/2 rounded"></div>

        <div className="h-[400px] bg-gray-800 rounded-lg"></div>

        {[1,2,3,4,5].map(i=>(
          <div key={i} className="h-5 bg-gray-800 rounded"></div>
        ))}
      </div>
    </main>
  );
}