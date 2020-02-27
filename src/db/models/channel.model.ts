import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import ISchema from '../../generics/baseInterface.interface';
import { Mesh, StrongSchema, createStrongSchema } from '../../ts-coverage';

export interface ChannelDocument extends ISchema
  {
    name:string
  TVShows:[
    {
      TVShowId:Types.ObjectId,
      startTime: Date,
      endTime:Date
    }
  ]
   };

  export class ChannelMethods {
    /**
     * print this doc _id.
     */
	//  printId: BoundTo<IUserModel> = function() { console.log(this._id); };
	// more methods ...
  }  

  const ChannelSchema = createStrongSchema(({
    name: { type: String, required: true },
    TVShows:{type: [{
          _id: false,
          TVShowId:{ type: Types.ObjectId, ref: 'TVShows', required: true },
          startTime:{ type: Date, required: true},
          endTime:{ type: Date, required: true}}], 
      required: false}
  } as StrongSchema<ChannelDocument>), new ChannelMethods(), { timestamps: true })

export type IChannelModel = Mesh<ChannelDocument, ChannelMethods, mongoose.Document>;

export const ChannelModel = mongoose.model<IChannelModel>('channels', ChannelSchema);