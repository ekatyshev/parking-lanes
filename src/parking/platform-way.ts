import L from 'leaflet'

import { type OsmWay } from '../utils/types/osm-data'
import { type PlatformWays } from '../utils/types/platform'
import { type PlatformPolylineOptions } from '../utils/types/leaflet'

export function parsePlatformWay(
    way: OsmWay,
    nodes: Record<number, number[]>,
    zoom: number,
    editorMode: boolean): PlatformWays | undefined {
    if (way.nodes[0] !== way.nodes.at(-1)) {
        const polylineNodes = way.nodes.map(x => nodes[x])
        const polyline: L.LatLngLiteral[] = polylineNodes.map((node) => ({ lat: node[0], lng: node[1] }))

        const ways: PlatformWays = {}

        const leafletPolyline = createPolyline(polyline, way, zoom)
        ways[way.type + way.id] = leafletPolyline

        return ways
    }
}

function createPolyline(line: L.LatLngLiteral[], osm: OsmWay, zoom: number) {
    const polylineOptions: PlatformPolylineOptions = {
        color: 'black',
        fillOpacity: 1,
        weight: getWeight(zoom),
        osm,
    }
    return L.polyline(line, polylineOptions)
}

export function updatePlatformWayStylesByZoom(ways: PlatformWays, zoom: number): void {
    const weight = getWeight(zoom)
    for (const way in ways)
        ways[way].setStyle({ weight })
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
