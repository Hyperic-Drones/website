"use client"

import { useEffect, useRef, useState } from "react"
import { select } from "d3-selection"
import { geoOrthographic, geoPath, geoGraticule, geoDistance, geoProjectionMutator } from "d3-geo"
import "d3-transition" // Import d3-transition to extend selection with transition methods
import { feature } from "topojson-client"

interface GeoFeature {
  type: string
  geometry: any
  properties: any
}

function interpolateProjection(raw0: any, raw1: any) {
  const mutate: any = geoProjectionMutator((t: number) => (x: number, y: number) => {
    const [x0, y0] = raw0(x, y)
    const [x1, y1] = raw1(x, y)
    return [x0 + t * (x1 - x0), y0 + t * (y1 - y0)]
  })
  let t = 0
  return Object.assign((mutate as any)(t), {
    alpha(_: number) {
      return arguments.length ? (mutate as any)((t = +_)) : t
    },
  })
}

export function GlobeToMapTransform() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [worldData, setWorldData] = useState<GeoFeature[]>([])
  const [rotation, setRotation] = useState([0, -30])
  const animationFrameRef = useRef<number>()

  const width = 800
  const height = 500

  // Load world data
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        const world: any = await response.json()
        const countries = feature(world, world.objects.countries).features
        setWorldData(countries)
      } catch (error) {
        const fallbackData = [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-180, -90],
                  [180, -90],
                  [180, 90],
                  [-180, 90],
                  [-180, -90],
                ],
              ],
            },
            properties: {},
          },
        ]
        setWorldData(fallbackData)
      }
    }

    loadWorldData()
  }, [])

  useEffect(() => {
    const animate = () => {
      setRotation((prev) => [(prev[0] + 0.2) % 360, prev[1]])
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const cities = [
    { name: "San Francisco", coords: [-122.4194, 37.7749] },
    { name: "Toronto", coords: [-79.3832, 43.6532] },
  ]

  // Initialize and update visualization
  useEffect(() => {
    if (!svgRef.current || worldData.length === 0) return

    const svg = select(svgRef.current)
    svg.selectAll("*").remove()

    const projection = geoOrthographic()
      .scale(200)
      .translate([width / 2, height / 2])
      .rotate([rotation[0], rotation[1]])
      .precision(0.1)

    const path = geoPath(projection)

    // Add graticule (grid lines)
    try {
      const graticule = geoGraticule()
      const graticulePath = path(graticule())
      if (graticulePath) {
        svg
          .append("path")
          .datum(graticule())
          .attr("d", graticulePath)
          .attr("fill", "none")
          .attr("stroke", "#404040")
          .attr("stroke-width", 0.5)
          .attr("opacity", 0.15)
      }
    } catch (error) {
      // Silent error handling
    }

    // Add countries
    svg
      .selectAll(".country")
      .data(worldData)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", (d) => {
        try {
          const pathString = path(d as any)
          if (!pathString) return ""
          if (typeof pathString === "string" && (pathString.includes("NaN") || pathString.includes("Infinity"))) {
            return ""
          }
          return pathString
        } catch (error) {
          return ""
        }
      })
      .attr("fill", "#0a0a0a")
      .attr("stroke", "#525252") // Changed stroke color from cyan to grey
      .attr("stroke-width", 0.8)
      .attr("opacity", 0.8)
      .style("visibility", function () {
        const pathData = select(this).attr("d")
        return pathData && pathData.length > 0 && !pathData.includes("NaN") ? "visible" : "hidden"
      })

    // Draw sphere outline
    try {
      const sphereOutline = path({ type: "Sphere" })
      if (sphereOutline) {
        svg
          .append("path")
          .datum({ type: "Sphere" })
          .attr("d", sphereOutline)
          .attr("fill", "none")
          .attr("stroke", "#525252") // Changed sphere outline from cyan to grey
          .attr("stroke-width", 1.5)
          .attr("opacity", 0.6)
      }
    } catch (error) {
      // Silent error handling
    }

    cities.forEach((city) => {
      const coords = projection(city.coords as [number, number])
      if (coords) {
        const [x, y] = coords
        // Check if the city is on the visible side of the globe
        const distance = geoDistance(
          city.coords as [number, number],
          projection.invert?.([width / 2, height / 2]) || [0, 0],
        )
        const isVisible = distance < Math.PI / 2

        if (isVisible) {
          const marker = svg
            .append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 2.5) // Made markers smaller (r: 2.5)
            .attr("fill", "#dc2626") // Muted red color (#dc2626)
            .attr("stroke", "#991b1b")
            .attr("stroke-width", 0.5)
            .attr("opacity", 0.9)

          // Add flashing animation
          marker
            .transition()
            .duration(800)
            .attr("opacity", 0.2)
            .transition()
            .duration(800)
            .attr("opacity", 0.9)
            .on("end", function repeat() {
              select(this)
                .transition()
                .duration(800)
                .attr("opacity", 0.2)
                .transition()
                .duration(800)
                .attr("opacity", 0.9)
                .on("end", repeat)
            })
        }
      }
    })
  }, [worldData, rotation])

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full rounded-lg bg-transparent"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  )
}
