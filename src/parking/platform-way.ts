import L from 'leaflet'
// import { parseOpeningHours } from '../utils/opening-hours'
// import { legend } from './legend'
// import { laneStyleByZoom as laneStyle } from './lane-styles'

// import { type ConditionalParkingCondition, type ParkingConditions } from '../utils/types/conditions'
import { type OsmWay, type OsmTags } from '../utils/types/osm-data'
// import { type ParkingLanes, type Side } from '../utils/types/parking'
import { type PlatformWays } from '../utils/types/platform'
import { type PlatformPolylineOptions } from '../utils/types/leaflet'
// import { parseConditionalTag } from '../utils/conditional-tag'
// import { getColor, getColorByDate } from './condition-color'
// import { getConditions as getParkingsConditions } from './access-condition'

export function parsePlatformWay(
    way: OsmWay,
    nodes: Record<number, number[]>,
    zoom: number,
    editorMode: boolean): PlatformWays | undefined {
    // const isMajor = wayIsMajor(way.tags)

    const polylineNodes = way.nodes.map(x => nodes[x])
    const polyline: L.LatLngLiteral[] = polylineNodes.map((node) => ({ lat: node[0], lng: node[1] }))

    // let emptyway = true

    const ways: PlatformWays = {}

    // for (const side of ['right', 'left'] as Side[]) {
    //     const conditions = getConditions(side, way.tags)
    //     if (conditions.default != null || (conditions.conditionalValues && conditions.conditionalValues.length > 0)) {
    //         const laneId = generateLaneId(way, side, conditions)
    //         const offset: number = isMajor ?
    //             laneStyle[zoom].offsetMajor as number :
    //             laneStyle[zoom].offsetMinor as number
    //         const leafletPolyline = createPolyline(polyline, conditions, side, way, offset, isMajor, zoom)
    //         ways[laneId] = leafletPolyline
    //         emptyway = false
    //     }
    // }
    // if (editorMode &&
    //     emptyway &&
    //     way.tags.highway &&
    //     highwayRegex.test(way.tags.highway)) {
    //     const laneId = generateLaneId(way)
    //     const leafletPolyline = createPolyline(polyline, undefined, 'right', way, 0, isMajor, zoom)
    //     ways[laneId] = leafletPolyline
    // }

    const leafletPolygon = createPolyline(polyline, way, zoom)
    ways[way.type + way.id] = leafletPolygon

    return ways
}

// export function parseChangedParkingLane(newOsm: OsmWay, lanes: ParkingLanes, datetime: Date, zoom: number): L.Polyline[] {
//     const lane = lanes['right' + newOsm.id] || lanes['left' + newOsm.id] || lanes['empty' + newOsm.id]
//     const polyline = lane.getLatLngs()
//     let emptyway = true
//
//     const newLanes: L.Polyline[] = []
//
//     for (const side of ['right', 'left'] as Side[]) {
//         const conditions = getConditions(side, newOsm.tags)
//         const id = side + newOsm.id
//         if (conditions.default != null) {
//             if (lanes[id]) {
//                 lanes[id].options.conditions = conditions
//                 lanes[id].setStyle({ color: getColorByDate(conditions, datetime) })
//             } else {
//                 const isMajor = wayIsMajor(newOsm.tags)
//                 const laneId = generateLaneId(newOsm, side, conditions)
//                 const leafletPolyline = createPolyline(polyline, conditions, side, newOsm, isMajor ? laneStyle[zoom].offsetMajor ?? 1 : laneStyle[zoom].offsetMinor ?? 0.5, isMajor, zoom)
//                 lanes[laneId] = leafletPolyline
//                 newLanes.push(leafletPolyline)
//             }
//             emptyway = false
//         } else if (lanes[id]) {
//             lanes[id].remove()
//             // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//             delete lanes[id]
//         }
//     }
//
//     if (emptyway) {
//         if (!lanes['empty' + newOsm.id]) {
//             const isMajor = wayIsMajor(newOsm.tags)
//             const laneId = generateLaneId(newOsm)
//             const leafletPolyline = createPolyline(polyline, undefined, 'right', newOsm, 0, isMajor, zoom)
//             lanes[laneId] = leafletPolyline
//             newLanes.push(leafletPolyline)
//         }
//     } else if (lanes['empty' + newOsm.id]) {
//         lanes['empty' + newOsm.id].remove()
//         // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//         delete lanes['empty' + newOsm.id]
//     }
//
//     return newLanes
// }

function createPolyline(line: L.LatLngLiteral[], osm: OsmWay, zoom: number) {
    const polylineOptions: PlatformPolylineOptions = {
        // color: getColor(conditions?.default),
        weight: getWeight(zoom),
        // offset: side === 'right' ? offset : -offset,
        // conditions,
        osm,
        // isMajor,
    }
    return L.polyline(line, polylineOptions)
}

export function updateWayStylesByZoom(ways: PlatformWays, zoom: number): void {
    const weight = getWeight(zoom)
    for (const way in ways)
        ways[way].setStyle({ weight })
}

function getWeight(zoom: number) {
    if (zoom < 12)
        return 1
    if (zoom < 14)
        return 1.4
    if (zoom < 15)
        return 1.6
    if (zoom < 16)
        return 1.8
    if (zoom < 18)
        return 2
    return 1.5
}
