import L from 'leaflet'

import { type RoutePolylineOptions } from '../utils/types/leaflet'
import { type OsmRelation, type OsmWay } from '../utils/types/osm-data'
import { type RouteWays } from '../utils/types/route'

export function parseRouteRelation(
    relation: OsmRelation,
    nodes: Record<number, number[]>,
    ways: Record<number, OsmWay>,
    zoom: number,
    editorMode: boolean): RouteWays | undefined {
    let relationHasWay = false;
    const newWays: RouteWays = {}

    for (const member of relation.members) {
        if (member.type === 'way') {
            relationHasWay = true;
            const way = ways[member.ref]
            if (way.tags?.highway && way.tags?.highway !== 'bus_stop') {
                const polylineNodes = way.nodes.map(x => nodes[x])
                const polyline: L.LatLngLiteral[] = polylineNodes.map((node) => ({lat: node[0], lng: node[1]}))

                const leafletPolyline = createPolyline(polyline, way, zoom)
                newWays[way.type + way.id] = leafletPolyline
            }
        }
    }

    return relationHasWay ? newWays : undefined
}

function createPolyline(line: L.LatLngLiteral[], osm: OsmWay, zoom: number) {
    const polylineOptions: RoutePolylineOptions = {
        color: 'green',
        fillOpacity: 1,
        weight: getWeight(zoom),
        osm,
    }
    return L.polyline(line, polylineOptions)
}

export function updateRouteWayStylesByZoom(routeWays: RouteWays, zoom: number): void {
    const weight = getWeight(zoom)
    for (const way in routeWays)
        routeWays[way].setStyle({ weight })
}

function getWeight(zoom: number) {
    if (zoom < 12)
        return 4
    if (zoom < 14)
        return 5
    if (zoom < 15)
        return 6
    if (zoom < 16)
        return 7
    if (zoom < 18)
        return 8
    return 6
}
