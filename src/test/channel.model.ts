import * as mongoose from 'mongoose';

export interface channelDocument extends mongoose.Document {
 name:string
  TVShows:[
    {
      TVShowId:mongoose.Schema.Types.ObjectId,
      startTime: Date,
      endTime:Date
    }
  ]
};

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
   TVShows:{
       type: [{
           TVShowId:{ type: mongoose.Schema.Types.ObjectId, ref: 'TVShows', required: true },
           startTime:{ type: Date, required: true},
           endTime:{ type: Date, required: true}

       }], 
       required: false
   }
});

export const ChannelModel = mongoose.model<channelDocument>('channels', channelSchema);