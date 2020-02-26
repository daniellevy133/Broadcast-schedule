import { MongooseQuery } from "./mongoose.query";

export class ChannelQuery {
    private startTime:Date;
    private endTime:Date;
    private skip:number;
    private limit:number;

    constructor(query:any){
        this.startTime = new Date(query.startTime);
        this.endTime = new Date(query.endTime);
        this.skip = parseInt(query.skip);
        this.limit = parseInt(query.limit);
    }

    public mongooseQueryCreator(): MongooseQuery {
        const mongooseQuery = new MongooseQuery(); 
        mongooseQuery.conditions = this.createSearchCondition();
        mongooseQuery.skip=this.skip;
        mongooseQuery.itemsPerPage = this.limit;
        return mongooseQuery;
    }

    private createSearchCondition(){
        const condition: {$or?:{}} ={};
        if(!isNaN(this.startTime.getTime())){
            if(!isNaN(this.endTime.getTime())){
                condition['$or']=[
                    {"startTime": {$gte: new Date(this.startTime), $lt: new Date(this.endTime)}},
                    {"endTime": {$gte: new Date(this.startTime), $lt: new Date(this.endTime)}}
                ];
            }else{
                condition['$or']=[
                    {"startTime":{$gte:new Date(this.startTime)}}
                ];
            }
        }else{
            condition['$or']=[
                {"startTime":{$gte:new Date()}}
            ];
        }
        return condition;
    }
}