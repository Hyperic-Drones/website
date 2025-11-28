"use client"
import { useEffect, useRef, useState } from "react"

export function DroneVisual() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/drone-outline.svg")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`)
        }
        return res.text()
      })
      .then((svgText) => {
        if (containerRef.current) {
          const parser = new DOMParser()
          const svgDoc = parser.parseFromString(svgText, "image/svg+xml")
          const svgElement = svgDoc.querySelector("svg")

          if (svgElement) {
            containerRef.current.innerHTML = ""

            // Create a group to wrap content for bounding box calculation
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g")
            while (svgElement.firstChild) {
              group.appendChild(svgElement.firstChild)
            }
            svgElement.appendChild(group)

            svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet")
            svgElement.style.display = "block"
            svgElement.style.margin = "0 auto"
            svgElement.style.width = "100%"
            svgElement.style.height = "100%"
            svgElement.style.objectFit = "contain"
            // Removed manual scale transform

            const allElements = group.querySelectorAll("*")
            allElements.forEach((el) => {
              if (el.hasAttribute("stroke")) {
                el.setAttribute("stroke", "white")
              }
              if (el.hasAttribute("fill") && el.getAttribute("fill") !== "none") {
                el.setAttribute("fill", "white")
              }
            })

            containerRef.current.appendChild(svgElement)

            // Calculate bounding box and update viewBox to crop whitespace
            try {
              const bbox = group.getBBox()
              if (bbox.width > 0 && bbox.height > 0) {
                const padding = 10
                svgElement.setAttribute(
                  "viewBox",
                  `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`
                )
              }
            } catch (e) {
              console.warn("Failed to calculate SVG bounding box:", e)
            }
          } else {
            setError("No SVG element found in file")
          }
        }
      })
      .catch((err) => {
        console.error("[v0] SVG load error:", err)
        setError(err.message)
      })
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      {error && <div className="text-red-400 text-sm">Error: {error}</div>}
    </div>
  )
}
