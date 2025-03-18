import type ICollection from "./ICollection";

export default class Collection implements ICollection {
    lat: number = 0;
    lng: number = 0;
    depth: number = 0;
    mag: number = 0;
    time: string;
    place: string;
    province?: {id: string, name: string};
    faultMegathrust?: {id: string, name: string};
    color: string;
    cluster: number | null;

    constructor({
            time, 
            lat, lng, 
            depth, 
            mag, 
            place, 
            color, 
            province, 
            faultMegathrust,
            cluster
        }: ICollection) {
        this.lat = lat;
        this.lng = lng;
        this.depth = depth;
        this.mag = mag;
        this.time = time;
        this.place = place;
        this.province = province;
        this.color = color;
        this.faultMegathrust = faultMegathrust;
        this.cluster = cluster;
    }
}
