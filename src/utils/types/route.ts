import { type OsmTags } from './osm-data'

export type RouteWays = Record<string, L.Polyline | any>

export interface TagValue {
    value: string
    imgSrc?: string
}

export interface RouteTagInfo {
    template: string
    values?: TagValue[]
    dependentTags?: string[]
    checkForNeedShowing: (tags: OsmTags, side: string) => boolean
}
