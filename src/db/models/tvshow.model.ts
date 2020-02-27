import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import ISchema from '../../generics/baseInterface.interface';
import { Mesh, StrongSchema, createStrongSchema } from '../../ts-coverage';

export interface TVShowDocument extends ISchema
  {
    name:string,
    channels:[Types.ObjectId],
    hosts:[string]
   };

export class TVShowMethods {
    /**
     * print this doc _id.
     */
	//  printId: BoundTo<IUserModel> = function() { console.log(this._id); };
	// more methods ...
  }  

  const TVShowSchema = createStrongSchema(({
    name: { type: String, required: true },
    channels:{type: [{ type: Types.ObjectId, ref: 'channels',required: true }],required: false},
    hosts:{type: [{ type: String,required: true }],required: false}  
  } as StrongSchema<TVShowDocument>), new TVShowMethods())

export type ITVShowModel = Mesh<TVShowDocument, TVShowMethods, mongoose.Document>;

export const TVShowModel = mongoose.model<ITVShowModel>('TVShows', TVShowSchema);