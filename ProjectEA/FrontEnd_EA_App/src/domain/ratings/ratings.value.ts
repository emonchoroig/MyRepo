import { RatingsEntity } from "./ratings.entity";

export class RatingsValue implements RatingsEntity{
    uuid: string;
    ratingType: "users" | "activities" | "locations" | "comments" | "publications";
    idRatedObject: string;
    ratingAverage: number;
    idRaters:[string];

    constructor({uuid,ratingType,idRatedObject,ratingAverage, idRaters}:{uuid:string,idRaters:[string], idRatedObject:string,ratingAverage:number,ratingType:"users" | "activities" | "locations" | "comments" | "publications"}){
        this.uuid=uuid;
        this.ratingType=ratingType;
        this.idRatedObject=idRatedObject;
        this.ratingAverage=ratingAverage;
        this.idRaters=idRaters;
    }
}