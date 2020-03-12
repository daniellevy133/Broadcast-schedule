import { MongooseQuery } from "./mongoose.query";
import DateObject from '../../../generics/date_object/interface/date.object';
import Creator from '../../../generics/creator';

export class ChannelQuery {
    private startTime:Date;
    private endTime:Date;
    private skip:number;
    private limit:number;
    private date:DateObject;

    constructor(query:any){
        this.date = Creator.createDateObject('dateMoment');
        this.startTime = this.date.createDate(query.startTime,query.formatTime);
        this.endTime = this.date.createDate(query.endTime,query.formatTime);
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
        if(!this.date.isValid(this.startTime)){
            if(!this.date.isValid(this.endTime)){
                condition['$or']=[
                    {"startTime": {$gte:this.startTime, $lt: this.endTime}},
                    {"endTime": {$gte: this.startTime, $lt: this.endTime}}
                ];
            }else{
                condition['$or']=[
                    {"startTime":{$gte:this.startTime}}
                ];
            }
        }else{
            condition['$or']=[
                {"startTime":{$gte:this.date.now()}}
            ];
        }
        return condition;
    }
}