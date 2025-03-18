import Collection from "./Collection";
import ICollection from "./Collection";
import { CollectionRoot } from "./CollectionRoot";

export class CollectionCreator extends CollectionRoot {
    createCollection(data: ICollection): ICollection {
        return new Collection(data);
    }
}
