import ICollection from "./Collection";

export abstract class CollectionRoot {
    abstract createCollection(data: ICollection): ICollection;
}
