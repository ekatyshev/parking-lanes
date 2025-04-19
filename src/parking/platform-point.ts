import L from 'leaflet'
import { type PlatformPointOptions } from '../utils/types/leaflet'
import { type OsmNode } from '../utils/types/osm-data'
import { type PlatformPoint } from '../utils/types/platform'
// import { getConditions } from './access-condition'
// import { getColor, getColorByDate } from './condition-color'

export function parsePlatformPoint(
    node: OsmNode,
    zoom: number,
    editorMode: boolean): PlatformPoint | undefined {
    // const conditions = getConditions(node.tags)
    return {
        [node.id]: createMarker(node, zoom),
    }
}

// export function updatePointColorsByDate(points: PlatformPoint, datetime: Date): void {
//     for (const point in points) {
//         const color = getColorByDate(points[point].options.conditions, datetime)
//         points[point].setStyle({ color })
//     }
// }

export function updatePlatformPointStylesByZoom(points: PlatformPoint, zoom: number): void {
    const radius = getRadius(zoom)
    for (const point in points)
        points[point].setStyle({ radius })
}

function createMarker(osm: OsmNode, zoom: number) {
    const platformPointOptions: PlatformPointOptions = {
        // color: getColor(conditions?.default),
        radius: getRadius(zoom),
        fillOpacity: 1,
        weight: 0,
        osm,
        // conditions,
    }
    return L.circleMarker({ lat: osm.lat, lng: osm.lon }, platformPointOptions)
}

function getRadius(zoom: number) {
    if (zoom < 12)
        return 1
    if (zoom < 14)
        return 2
    if (zoom < 15)
        return 3
    if (zoom < 16)
        return 4
    if (zoom < 18)
        return 6
    return 10
}
