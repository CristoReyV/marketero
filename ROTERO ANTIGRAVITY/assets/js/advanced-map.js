"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const width = 1000;
    const height = 500;

    // Create an Equirectangular projection similar to typical generic world maps
    const projection = d3.geoNaturalEarth1()
        .scale(160)
        .translate([width / 2, height / 2 + 20]);

    const pathGenerator = d3.geoPath().projection(projection);

    // We fetch the world topojson locally or from CDN (here we use CDN for speed)
    Promise.all([
        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    ]).then(([worldData]) => {
        const countries = topojson.feature(worldData, worldData.objects.countries).features;

        // 1. Draw Countries
        const mapGroup = d3.select("#map-countries");
        mapGroup.selectAll("path")
            .data(countries)
            .enter()
            .append("path")
            .attr("d", pathGenerator)
            .attr("fill", "#212f4d")
            .attr("stroke", "#3a506b")
            .attr("stroke-width", 0.8)
            .style("transition", "fill 0.3s")
            .on("mouseover", function () {
                d3.select(this).attr("fill", "#2c3e66");
            })
            .on("mouseout", function () {
                d3.select(this).attr("fill", "#212f4d");
            });

        // 2. Define Ports (Longitude, Latitude). Custom offsets applied to avoid overlaps.
        const ports = [
            { id: "manzanillo", name: "Manzanillo", coords: [-104.3164, 19.0524], mx: true, offsetX: -8, offsetY: 0, anchor: "end" },
            { id: "veracruz", name: "Veracruz", coords: [-96.1342, 19.1738], mx: true, offsetX: 8, offsetY: 12, anchor: "start" },
            { id: "altamira", name: "Altamira", coords: [-97.9358, 22.3941], mx: true, offsetX: 8, offsetY: -4, anchor: "start" },
            { id: "ens", name: "Ensenada", coords: [-116.5964, 31.8667], mx: true, offsetX: -8, offsetY: -4, anchor: "end" },
            { id: "lc", name: "Lázaro Cárdenas", coords: [-102.1979, 17.9620], mx: true, offsetX: -8, offsetY: 14, anchor: "end" },

            { id: "la", name: "Los Ángeles", coords: [-118.2437, 34.0522] },
            { id: "ny", name: "Nueva York", coords: [-74.0060, 40.7128] },
            { id: "pa", name: "Panamá", coords: [-79.5199, 8.9824] },
            { id: "sa", name: "Santos", coords: [-46.3333, -23.9608] },
            { id: "ro", name: "Rotterdam", coords: [4.4777, 51.9244] },
            { id: "su", name: "Suez", coords: [32.5322, 29.9668] },
            { id: "sg", name: "Singapur", coords: [103.8198, 1.3521] },
            { id: "sh", name: "Shanghái", coords: [121.4737, 31.2304] },
            { id: "tk", name: "Tokio", coords: [139.6917, 35.6895], offsetX: 8, offsetY: -4, anchor: "start" },
            { id: "db", name: "Dubái", coords: [55.2708, 25.2048] },
            { id: "sd", name: "Sídney", coords: [151.2093, -33.8688] }
        ];

        const routesGroup = d3.select("#map-routes");
        const nodesGroup = d3.select("#map-nodes");

        // 3. Define Routes (start ID, end ID)
        const routes = [
            { start: "manzanillo", end: "sh" },
            { start: "manzanillo", end: "tk" },
            { start: "manzanillo", end: "la" },
            { start: "ens", end: "la" },
            { start: "lc", end: "pa" },
            { start: "veracruz", end: "pa" },
            { start: "altamira", end: "ny" },
            { start: "altamira", end: "ro" },
            { start: "pa", end: "sa" },
            { start: "ro", end: "su" },
            { start: "su", end: "db" },
            { start: "su", end: "sg" },
            { start: "sh", end: "sg" },
            { start: "tk", end: "sg" },
            { start: "sg", end: "sd" }
        ];

        // Build curve generator between points
        const lineGenerator = d3.line()
            .curve(d3.curveBasis)
            .x(d => d[0])
            .y(d => d[1]);

        // Function to animate a random single route
        function playRandomRoute() {
            if (routes.length === 0) return;
            const route = routes[Math.floor(Math.random() * routes.length)];

            const startPort = ports.find(p => p.id === route.start);
            const endPort = ports.find(p => p.id === route.end);

            if (startPort && endPort) {
                const startXY = projection(startPort.coords);
                const endXY = projection(endPort.coords);

                // Calculate a control point to make the line curve elegantly
                const midX = (startXY[0] + endXY[0]) / 2;
                const midY = (startXY[1] + endXY[1]) / 2 - 80; // Arc upwards
                const points = [startXY, [midX, midY], endXY];

                const path = routesGroup.append("path")
                    .attr("class", "route")
                    .attr("d", lineGenerator(points));

                const totalLength = path.node().getTotalLength();

                path
                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .style("opacity", 0)
                    .transition()
                    .duration(200)
                    .style("opacity", 0.9) // Line appears
                    .transition()
                    .duration(2000 + Math.random() * 1500) // Draw from A to B
                    .ease(d3.easeCubicInOut)
                    .attr("stroke-dashoffset", 0)
                    .transition()
                    .duration(1500) // Fade out
                    .style("opacity", 0)
                    .on("end", () => {
                        path.remove(); // Cleanup DOM element
                        // Rest briefly, then pop another random route
                        setTimeout(playRandomRoute, Math.random() * 1500);
                    });
            } else {
                setTimeout(playRandomRoute, 500);
            }
        }

        // Start 2 concurrent route animations
        setTimeout(playRandomRoute, 500);
        setTimeout(playRandomRoute, 2500);

        // Draw Ports
        ports.forEach(port => {
            const xy = projection(port.coords);
            if (xy) {
                const portGroup = nodesGroup.append("g")
                    .attr("transform", `translate(${xy[0]}, ${xy[1]})`);

                portGroup.append("circle")
                    .attr("r", port.mx ? 5 : 4)
                    .attr("class", "node" + (port.mx ? " node-pulse" : ""))
                    .attr("filter", "url(#glow)")
                    .attr("fill", port.mx ? "#00e5ff" : "#ff9f1c");

                // Dynamic label placement to prevent overlapping
                portGroup.append("text")
                    .attr("class", "label")
                    .attr("x", port.offsetX !== undefined ? port.offsetX : 8)
                    .attr("y", port.offsetY !== undefined ? port.offsetY : 4)
                    .attr("text-anchor", port.anchor || "start")
                    .style("font-family", "'Outfit', Arial, sans-serif")
                    .style("font-size", port.mx ? "12px" : "10px")
                    .style("font-weight", port.mx ? "bold" : "normal")
                    .style("fill", port.mx ? "#fff" : "#aeb8c7")
                    .text(port.name);
            }
        });

    }).catch(err => console.error("Error loading map:", err));
});
