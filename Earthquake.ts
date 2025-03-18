import axios from "@/utils/axios";
import Collection from "./Collection";
import type Filter from "./Filter";
import { ref, inject } from "vue";
import moment from "moment";
import useLoaderStore from "@/stores/loader";
import Swal from 'sweetalert2'
import { CollectionCreator } from "./CollectionCreator";

const loader = useLoaderStore();
const swal = inject('$swal');

export default class Earthquake {
    collections:Collection[] = [];
    interval?:number;
    statusInterval?: 'run' | 'pause' | 'stop' = 'stop';
    iterative = 0;
    data: any = [];
    colors = [
        '#E13704', '#97F611', '#E803D5', '#D2BF45', '#D8058E',
        '#C2C654', '#D43C62', '#B3592F', '#C95217', '#423CD7',
        '#B347D4', '#FC451C', '#F1F503', '#96B02E', '#D41340',
        '#6F24D0', '#B02D2D', '#B61AB1', '#CC5291', '#33CB0D',
        '#DDA12A', '#9D2AFB', '#C10E7F', '#BB2961', '#6017F2',
        '#EA3CA4', '#CCA62A', '#CF4442', '#E5281E', '#F70C33',
        '#CC9E16', '#ABC23B', '#FC31CA', '#CC190C', '#992AB5',
        '#B03B2C', '#82F813', '#8E5DCF', '#4D38B8', '#78DB42',
        '#24D914', '#381EFB', '#F432DD', '#67B135', '#D4F031',
        '#BA25C5', '#CC3A52', '#F82F86', '#B5D41C', '#47EA1F'
    ];    

    constructor(){}

    async getData(filter?:Filter): Promise<void>{
        try{
            loader?.loaderShow();
            this.statusInterval = 'run';
            let data:any = await axios().get(`get-data`, {params: {
                startDate: filter?.dateReange?.[0] ? moment(filter?.dateReange?.[0]).format('YYYY-MM-DD') : undefined,
                endDate: filter?.dateReange?.[1] ? moment(filter?.dateReange?.[1]).format('YYYY-MM-DD') : undefined,
                // startDate: filter?.dateReange?.[0] ? moment(filter?.dateReange?.[0]).format('YYYY-MM-DD') : undefined,
                // endDate: filter?.dateReange?.[1] ? moment(filter?.dateReange?.[1])?.endOf('year').format('YYYY-MM-DD') : undefined,
                magnitudeStart: filter?.magnitudeStart,
                magnitudeEnd: filter?.magnitudeEnd,
                depthStart: filter?.depthStart,
                depthEnd: filter?.depthEnd,
                provinceId: filter?.province?.selected?.id,
                clusteringAlgoritmId: filter?.clusteringAlgoritm?.selected?.id,
                bestK: filter?.bestK,
            }});
            this.data = data?.data?.data;
            this.collections = [];
            this.run(filter);
        }
        catch(err:any){
            Swal?.fire({title: 'Error', text: err?.response?.data?.message, icon: 'error'});
            this?.stop();
        }
        finally {
            loader?.loaderHide();
        }
    }

    run(filter?:Filter): void {
        // for(let i = 0; i < data?.length; i++){
        //     if(isNaN(data[i]?.latitude) || isNaN(data[i]?.longtitude)) {i++; return;};
        //     this.collections.push(new Collection({
        //         lat: Number(data[i]?.latitude),
        //         lng: Number(data[i]?.longtitude),
        //         depth: Number(data[i]?.depth),
        //         mag: Number(data[i]?.magnitude),
        //         time: data[i]?.time,
        //         place: data[i]?.place,
        //         province: data[i]?.province
        //     }));
        // }

        const collectionCreator = new CollectionCreator();
        this.iterative = 0;
        this.interval = setInterval(() => {
            for(let i = 0; i < 100; i++){
                if(this?.iterative >= this?.data?.length){
                    this.stop();
                    return;
                }
    
                if(isNaN(this?.data[this?.iterative]?.latitude) || isNaN(this?.data[this?.iterative]?.longtitude)) {this.iterative++; return;};
    
                this.collections.push(collectionCreator.createCollection({
                    lat: Number(this?.data[this?.iterative]?.latitude),
                    lng: Number(this?.data[this?.iterative]?.longtitude),
                    depth: Number(this?.data[this?.iterative]?.depth),
                    mag: Number(this?.data[this?.iterative]?.magnitude),
                    time: this?.data[this?.iterative]?.time,
                    place: this?.data[this?.iterative]?.place,
                    province: this?.data[this?.iterative]?.province,
                    faultMegathrust: this?.data[this?.iterative]?.faultMegathrust,
                    cluster: this?.data[this?.iterative]?.cluster,
                    color: this.colors?.[Number(this?.data[this?.iterative]?.cluster)] || '#b91c1c',
                }));
                this.iterative++;
            }
        }, Number(filter?.interval || 50) || 50);
    }

    pause(): void {
        clearInterval(this.interval);
        this.statusInterval = 'pause';
    }

    continue(): void {
        this.run();
        this.statusInterval = 'run';
    }

    stop(): void {
        this.iterative = 0;
        clearInterval(this.interval);
        this.statusInterval = 'stop';
    }

    clear():void {
        this.stop();
        setTimeout(() => {
            this.collections = [];
        },100)
    }
}
