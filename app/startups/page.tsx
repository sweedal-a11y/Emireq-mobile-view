import StartupsDashboard from "@/components/startups/StartupsDashboard";

export default function StartupsPage() {
  return (
    <div className="min-h-screen bg-white flex justify-center items-start">
      <div className="w-full max-w-[430px] bg-white min-h-screen sm:shadow-2xl sm:shadow-gray-400/30 relative">
        <StartupsDashboard />
      </div>
    </div>
  );
}
