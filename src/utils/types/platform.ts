import { type OsmTags } from './osm-data'

// export type Side = 'left' | 'right'

// export interface StyleMapInterface {
//     weightMinor?: number
//     weightMajor?: number
//
//     offsetMajor?: number
//     offsetMinor?: number
// }

export type PlatformAreas = Record<string, L.Polyline | any>

export type PlatformWays = Record<string, L.Polyline | any>

export type PlatformPoint = Record<string, L.Marker | any>

export interface TagValue {
    value: string
    imgSrc?: string
}

export interface PlatformTagInfo {
    template: string
    values?: TagValue[]
    dependentTags?: string[]
    checkForNeedShowing: (tags: OsmTags, side: string) => boolean
}
