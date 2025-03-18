export default interface ICollection {
    lat: number;
    lng: number;
    depth: number;
    mag: number;
    time: string;
    place: string;
    province?: {id: string, name: string};
    faultMegathrust?: {id: string, name: string};
    color: string;
    cluster: number | null;
}
