import { MongooseQuery } from "./mongoose.query";

export class TVShowQuery {
    private TVShowName:string;
    private channelName:string;
    private hosts:string;
    private skip:number;
    private limit:number;

    constructor(query:any){
        this.TVShowName = query.tvshowName;
        this.channelName = query.channelName;
        this.hosts = query.host;
        this.skip = parseInt(query.skip);
        this.limit = this.skip+parseInt(query.limit);
    }

    public mongooseQueryCreator(): MongooseQuery {
        const mongooseQuery = new MongooseQuery(); 
        mongooseQuery.conditions = this.createSearchCondition();
        mongooseQuery.skip = this.skip;
        mongooseQuery.itemsPerPage = this.limit;
        return mongooseQuery;
    }

    private createSearchCondition() {
        const condition: {name?:{}|undefined,'channels.name'?:{}|undefined,hosts?:{}|undefined} ={};
        if (this.TVShowName){
            condition.name ={ $regex: this.TVShowName};
        }
        if (this.channelName){
            condition['channels.name']={$regex : this.channelName };
        }
        if (this.hosts){
            condition.hosts ={ $regex: this.hosts};
        }
        return condition;
    }
}