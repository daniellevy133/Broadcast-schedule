import {TVShowModel,TVShowDocument,TVShowMethods} from '../../db/models/tvshow.model';
import {ChannelModel,ChannelDocument,ChannelMethods} from '../../db/models/channel.model';
import {MongooseQuery} from '../models/query/mongoose.query'
import ISchema from '../../generics/baseInterface.interface';
import DateObject from '../../generics/date_object/interface/date.object'
import Creator from '../../generics/creator';

class TVShowrHandler {

    private date:DateObject;

    constructor(){
        this.date = Creator.createDateObject('dateMoment');
    }

    async findTVShowById(_id:ISchema){
        TVShowMethods;
        ChannelMethods;
        try{
            const TVShow = await TVShowModel.findById(_id).populate('channels','name').exec();
            return TVShow;
        }catch(error){
            throw new Error(error);
        }
    }

    async search(mongooseQuery:MongooseQuery){
        const pipeline = [
            {
                $lookup:{
                    from:'channels',
                    localField: 'channels',
                    foreignField:'_id',
                    as:'channels'
                }
            },
            {
               $unwind:
               {
                "path": "$channels",
                "preserveNullAndEmptyArrays": true
               } 
            },
            {
                $unwind:
                {
                 "path": "$hosts",
                 "preserveNullAndEmptyArrays": true
                } 
             },
            {
                $project:
                {
                    _id:true,
                    name:true,
                    hosts:true,
                    'channels.name':true,
                    'channels._id':true,
                }
            },
            {
                $match:mongooseQuery.conditions
            },
            {
                $group:
                {
                    _id:'$_id',
                    name:{$push:'$name'},
                    hosts:{$push:'$hosts'},
                    channels:{$push:'$channels'}

                }
            },
            {
                $unwind:
                {
                 "path": "$name",
                 "preserveNullAndEmptyArrays": true
                } 
             },
            {
				$skip: mongooseQuery.skip
            },
            {
				$limit: mongooseQuery.itemsPerPage
			}
        ];
        try{
            const TVShows = await TVShowModel.aggregate(pipeline).exec();
            return TVShows as TVShowDocument[];
        }catch(error){
            throw new Error(error);
        }
    }

    async editTVShow(newTVShow:any){
        const editTVShow = { 
            _id:newTVShow._id,
            name:newTVShow.name
        }
        try {
			const updated = await TVShowModel.findOneAndUpdate({ _id: editTVShow._id }, { $set: editTVShow }).lean().exec();
			return updated as TVShowDocument;
		} catch (error) {
			throw new Error(error);
        }
    }

    async editChannelToTVShow(channelId:ISchema,tvshowId:ISchema,rangeDates:string[]){
        const datesRange:Date[]=[
            this.date.createDate(rangeDates[0],rangeDates[2]),
            this.date.createDate(rangeDates[1],rangeDates[2])
        ];
        try{
            if(await this.checkAvilability(channelId,datesRange)){
                const editTVShow = TVShowModel.findById(tvshowId).exec();
                const editChannel = ChannelModel.findById(channelId).exec();
                const results = await Promise.all([editTVShow,editChannel]);
                if(!results[0]?.channels.includes(channelId._id)){
                    results[0]?.channels.push(channelId._id);
                }
                results[1]?.TVShows.push({TVShowId:tvshowId._id ,startTime:datesRange[0],endTime:datesRange[1]});
                results[1]?.TVShows.sort((show1,show2)=> this.date.isSameOrBefore(show1.startTime,show2.startTime));
                const editAll = await Promise.all([TVShowModel.findByIdAndUpdate(tvshowId._id,results[0]).exec(),
                           ChannelModel.findByIdAndUpdate(channelId,results[1]).exec()]);
                return editAll;

            }else{
                throw new Error('not avilability Time');
            }
        }catch(error){
            throw new Error(error);
        }
    }

    async searchDateRange(_idChannel:ISchema,mongooseQuery:MongooseQuery){
        const pipeline = [
            {
                $match:_idChannel
            },
            {
                $unwind:
                {
                 "path": "$TVShows",
                 "preserveNullAndEmptyArrays": true
                } 
             },
            {
                $lookup:{
                    from:'tvshows',
                    localField: 'TVShows.TVShowId',
                    foreignField:'_id',
                    as:'TVShow'
                }
            },
            {
                $unwind:
                {
                 "path": "$TVShow",
                 "preserveNullAndEmptyArrays": true
                } 
             },
             {
                $project:
                {
                    _id:'$TVShow._id',
                    name:'$TVShow.name',
                    hosts:'$TVShow.hosts',
                    channelName:'$name',
                    startTime:'$TVShows.startTime',
                    endTime:'$TVShows.endTime'
                }
            },
            {
                $match:mongooseQuery.conditions
            },
            {
				$skip: mongooseQuery.skip
            },
            {
				$limit: mongooseQuery.itemsPerPage
			}
        ];
        try{
            const channels = await ChannelModel.aggregate(pipeline).exec();
            return channels as ChannelDocument[];
        }catch(error){
            throw new Error(error);
        }
    }

    private async checkAvilability(channelId:ISchema,rangeDates:Date[]){
        const pipeline = [
            {
                $match:channelId
            },
            {
                $unwind:{
                    "path": "$TVShows",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $match:{$or:[{"TVShows.endTime":{$gte:rangeDates[0]}},{"TVShows.endTime":{$eq:rangeDates[0]}}]}
            },
            {
                $group:
                {
                    _id:'$_id',
                    TVShows:{$push:'$TVShows'}
                }
            }
        ];
        try{
            const Channels:ChannelDocument[] = await ChannelModel.aggregate(pipeline).exec();
            return (Channels.length === 0 || this.date.isSameOrBefore(rangeDates[1],Channels[0].TVShows[0].startTime))
        }catch(error){
            throw new Error(error);
        }
    }


}

export default TVShowrHandler;