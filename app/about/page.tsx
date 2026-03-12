import Navbar from "@/components/Navbar";
import AboutContent from "@/components/AboutContent";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex justify-center items-start">
      <div className="w-full max-w-[430px] bg-white min-h-screen sm:shadow-2xl sm:shadow-gray-400/30 relative">
        <Navbar />
        <AboutContent />
        <div className="h-8" />
      </div>
    </div>
  );
}