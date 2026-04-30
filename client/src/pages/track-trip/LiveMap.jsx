import { useEffect, useRef, useState } from "react";
const mapboxgl = await import("mapbox-gl");
import "mapbox-gl/dist/mapbox-gl.css";


console.log(import.meta.env.VITE_MAPBOX_TOKEN, mapboxgl);

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function getClosestIndex(route, truckPosition) {
    let minDist = Infinity;
    let index = 0;

    route.forEach(([lat, lng], i) => {
        const dist = Math.hypot(lat - truckPosition[0], lng - truckPosition[1]);
        if (dist < minDist) {
            minDist = dist;
            index = i;
        }
    });

    return index;
}

export default function LiveMap({ routePoints, truckPosition, tripData }) {
    const mapLoadedRef = useRef(false);
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const truckRef = useRef(null);
    const startRef = useRef(null);
    const endRef = useRef(null);
    const fittedRef = useRef(false);
    const stopMarkersRef = useRef([]);
    // Init map once

     useEffect(() => {
        let map;

        async function initMap() {
            const mapboxgl = (await import("mapbox-gl")).default;

            const token = import.meta.env.VITE_MAPBOX_TOKEN;

            if (!token) {
                console.error("Mapbox token missing");
                return;
            }

            mapboxgl.accessToken = token;

            map = new mapboxgl.Map({
                container: containerRef.current,
                style: "mapbox://styles/mapbox/streets-v12",
                center: [73.85, 18.52],
                zoom: 7,
            });

            mapRef.current = map;
        }

        if (!mapRef.current && containerRef.current) {
            initMap();
        }

        return () => map?.remove();
    }, []);

    // useEffect(() => {
    //     if (mapRef.current || !containerRef.current) return;
    //     mapRef.current = new mapboxgl.Map({
    //         container: containerRef.current,
    //         style: "mapbox://styles/mapbox/streets-v12",
    //         center: [73.85, 18.52],
    //         zoom: 7,
    //     });

    //     mapRef.current.on("load", () => {
    //         mapLoadedRef.current = true;
    //     });
    //     mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    // }, []);

    // Draw/update route + fixed markers when routePoints change
    useEffect(() => {
        const map = mapRef.current;

        if (!map || !routePoints?.length) return;

        const drawRoute = () => {
            const fullCoords = routePoints.map(([lat, lng]) => [lng, lat]);

            const splitIdx = truckPosition
                ? getClosestIndex(routePoints, truckPosition)
                : 0;

            const doneCoords = routePoints
                .slice(0, splitIdx + 1)
                .map(([lat, lng]) => [lng, lat]);
            const restCoords = routePoints
                .slice(splitIdx)
                .map(([lat, lng]) => [lng, lat]);

            function upsertLayer(srcId, layerId, coords, color, width, dash) {
                const gj = {
                    type: "Feature",
                    geometry: { type: "LineString", coordinates: coords },
                };
                if (map.getSource(srcId)) {
                    map.getSource(srcId).setData(gj);
                } else {
                    map.addSource(srcId, { type: "geojson", data: gj });
                    const paint = {
                        "line-color": color,
                        "line-width": width,
                        "line-opacity": 0.9,
                        ...(dash ? { "line-dasharray": [4, 3] } : {}),
                    };
                    map.addLayer({
                        id: layerId,
                        type: "line",
                        source: srcId,
                        layout: { "line-join": "round", "line-cap": "round" },
                        paint,
                    });
                }
            }

            upsertLayer("src-full", "lyr-full", fullCoords, "#cbd5e1", 4, false); // gray base
            upsertLayer("src-done", "lyr-done", doneCoords, "#16a34a", 5, false); // green completed
            upsertLayer("src-rest", "lyr-rest", restCoords, "#2563eb", 4, true); // blue dashed remaining

            // DC marker
            const sp = routePoints[0];
            if (sp) {
                startRef.current?.remove();
                const el = document.createElement("div");
                el.innerHTML = `<div style="background:#1e40af;width:38px;height:38px;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center;font-size:17px">🏭</div>`;
                startRef.current = new mapboxgl.Marker({
                    element: el,
                    anchor: "center",
                })
                    .setLngLat([sp[1], sp[0]])
                    .setPopup(
                        new mapboxgl.Popup({ offset: 22 }).setHTML(
                            `<strong>📦 ${tripData?.trip?.start ?? "Data Center"}</strong>`,
                        ),
                    )
                    .addTo(map);
            }

            // Store marker
            // const ep = routePoints[routePoints.length - 1];
            // if (ep) {
            //   endRef.current?.remove();
            //   const el = document.createElement("div");
            //   el.innerHTML = `<div style="background:#15803d;width:38px;height:38px;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center;font-size:17px">🏪</div>`;
            //   endRef.current = new mapboxgl.Marker({ element: el, anchor: "center" })
            //     .setLngLat([ep[1], ep[0]])
            //     .setPopup(
            //       new mapboxgl.Popup({ offset: 22 }).setHTML(
            //         `<strong>🏪 ${tripData?.trip?.end ?? "Store"}</strong>`,
            //       ),
            //     )
            //     .addTo(map);
            // }
            // Clear old markers
            stopMarkersRef.current.forEach((m) => m.remove());
            stopMarkersRef.current = [];

            // Add markers for all stops
            tripData?.checkpoints?.forEach((cp, i) => {
                if (!cp.lat || !cp.lng) return;

                const el = document.createElement("div");
                el.innerHTML = `
    <div style="
      background:${cp.done ? "#16a34a" : "#f59e0b"};
      width:38px;height:38px;border-radius:50%;
      border:2.5px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,.28);
      display:flex;align-items:center;justify-content:center;
      font-size:17px">
      ${i === 0 ? "🏭" : "🏪"}
    </div>`;

                const marker = new mapboxgl.Marker({ element: el })
                    .setLngLat([cp.lng, cp.lat])
                    .setPopup(
                        new mapboxgl.Popup().setHTML(
                            `<strong>${cp.name}</strong><br/>ETA: ${cp.time}`
                        )
                    )
                    .addTo(map);

                stopMarkersRef.current.push(marker);
            });

            // Fit bounds once
            if (!fittedRef.current) {
                const bounds = new mapboxgl.LngLatBounds();
                routePoints.forEach(([lat, lng]) => bounds.extend([lng, lat]));
                map.fitBounds(bounds, { padding: 80, duration: 1200 });
                fittedRef.current = true;
            }
        };

        if (!map.loaded()) {
            map.once("load", drawRoute);
        } else {
            drawRoute();
        }
    }, [routePoints, tripData, truckPosition]);

    // Update route split lines when fraction changes

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !routePoints?.length) return;

        const splitIdx = truckPosition
            ? getClosestIndex(routePoints, truckPosition)
            : 0;

        const doneCoords = routePoints
            .slice(0, splitIdx + 1)
            .map(([lat, lng]) => [lng, lat]);
        const restCoords = routePoints
            .slice(splitIdx)
            .map(([lat, lng]) => [lng, lat]);

        const gj = (c) => ({
            type: "Feature",
            geometry: { type: "LineString", coordinates: c },
        });

        if (map.getSource("src-done"))
            map.getSource("src-done").setData(gj(doneCoords));
        if (map.getSource("src-rest"))
            map.getSource("src-rest").setData(gj(restCoords));
    }, [routePoints, truckPosition]);

    // Update truck marker position smoothly
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !truckPosition) return;

        if (!truckRef.current) {
            const el = document.createElement("div");
            el.innerHTML = `<div style="background:#701a40;width:42px;height:42px;border-radius:50%;border:3px solid white;box-shadow:0 3px 14px rgba(112,26,64,.42);display:flex;align-items:center;justify-content:center;font-size:19px">🚛</div>`;
            truckRef.current = new mapboxgl.Marker({ element: el, anchor: "center" })
                .setLngLat([truckPosition[1], truckPosition[0]])
                .setPopup(
                    new mapboxgl.Popup({ offset: 26 }).setHTML(
                        `<strong>${tripData?.trip?.truck ?? "Truck"}</strong>`,
                    ),
                )
                .addTo(map);
        } else {
            truckRef.current.setLngLat([truckPosition[1], truckPosition[0]]);
        }
    }, [truckPosition]);

    useEffect(() => {
        return () => {
            truckRef.current?.remove();
            startRef.current?.remove();
            endRef.current?.remove();
            stopMarkersRef.current.forEach((m) => m.remove());
        };
    }, []);

    return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}