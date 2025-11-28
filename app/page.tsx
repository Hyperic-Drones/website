import { GlobeToMapTransform } from "@/components/globe-to-map-transform"
import { DroneVisual } from "@/components/drone-visual"

export default function Demo22Page() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Globe */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
          <div className="mb-8 text-center space-y-4">
            {/* Updated headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">Hyperic</h1>
            {/* Updated tagline */}
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
              Fully autonomous drones for defense and industrials.
            </p>
          </div>
          <div className="w-full max-w-6xl h-[600px]">
            <GlobeToMapTransform />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="relative py-32 px-4 md:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950/50 to-black" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-[0.2em]">About Us</h2>
              </div>

              {/* New mission-focused content about North America's unmanned systems history and Hyperic's purpose */}
              <div className="space-y-6 text-neutral-400 leading-relaxed">
                <p className="text-lg">
                  Two decades ago, North America led the world in unmanned systems. We built the platforms, the
                  components, the research, and the doctrine that defined modern robotics.
                </p>
                <p>
                  Today, we are dependent. We produce almost none of the drones we rely on. China captured over 70
                  percent of the US market, locking the West into foreign supply chains at the exact moment drones
                  became central to warfare, intelligence, industry, and emergency response.
                </p>
                <p>
                  Hyperic is here to change that. We are creating scalable drones that can take natural-language
                  commands, autonomously execute missions, and coordinate as adaptive swarms built for defense,
                  infrastructure, and industrial operations.
                </p>
                <p>
                  We build the full stack: airframes, flight computers, charging infrastructure, and an autonomy layer
                  capable of running entire swarms with one operator.
                </p>
                <p className="text-white font-medium">
                  No pilots.
                  <br />
                  No foreign choke points.
                  <br />
                  No dependency.
                </p>
              </div>
            </div>

            {/* Right: Drone Visual */}
            <div className="w-full min-h-[800px] flex items-center justify-center rounded-lg p-4">
              <div className="w-full h-[700px]">
                <DroneVisual />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-neutral-900 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-600">© 2025 Hyperic</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-neutral-600 hover:text-neutral-400 transition-colors">
              Contact
            </a>
            <a href="#" className="text-sm text-neutral-600 hover:text-neutral-400 transition-colors">
              Careers
            </a>
            <a href="#" className="text-sm text-neutral-600 hover:text-neutral-400 transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
