import CrudController from '../../generics/baseCrud.controller';
import {TVShowModel,TVShowDocument} from '../../db/models/tvshow.model';
import { Request, Response, NextFunction } from 'express';
import TVShowrHandler from '../handlers/TVShow.handler';
import {TVShowQuery} from '../models/query/TVShow.query';
import {ChannelQuery} from '../models/query/Channel.query';
import ISchema from '../../generics/baseInterface.interface';
import { Types } from 'mongoose';


class TVShowController extends CrudController{

    private handler:TVShowrHandler;

    constructor(){
        super();
        this.handler = new TVShowrHandler();
    }

    protected initializeRoutes(): void {
        this.router.get('/',this.getAll.bind(this));
        this.router.post('/',this.create.bind(this));
        this.router.put('/',this.editTVShow.bind(this));
        this.router.get('/byId',this.getTVShowById.bind(this));
        this.router.get('/search',this.searchTVShows.bind(this));
        this.router.put('/addTVShowToChannel',this.addTVShowToChannel.bind(this));
        this.router.get('/tvshowByRangeDates',this.searchTVShowsByDate.bind(this));
    }    
    protected getSchema(): import("mongoose").Model<any, {}> {
        return TVShowModel;
    }

    async getTVShowById (request: Request, response: Response, next: NextFunction) {
        const itemId:TVShowDocument = request.query;
        try{
            const tvShow = await this.handler.findTVShowById(itemId);
            return response.send(tvShow);
        } catch (error) {
			next(error)
        }
        return;
    }

    async searchTVShows (request: Request, response: Response, next: NextFunction) {
        const tvShowQuery:TVShowQuery = new TVShowQuery(request.query);
        try{
            const items = await this.handler.search(tvShowQuery.mongooseQueryCreator());
            return response.send(items);
            request;
        }catch(error){
            next(error);
        }
        return;
    }

    async editTVShow  (request: Request, response: Response, next: NextFunction) {
        const itemData: ISchema = request.body;
        try{
            const updated = await this.handler.editTVShow(itemData);
            return response.send(updated)
        }catch(error){
            next(error);
        }
        return;
    }

    async addTVShowToChannel(request: Request, response: Response, next: NextFunction) {
        const channelId:ISchema = {
            _id:Types.ObjectId(request.query.channelId)
        }
        const tvshowId:ISchema = {
            _id:Types.ObjectId(request.query.tvshowId)
        }
        const rangeDates:Date[]=[];
        rangeDates.push(new Date(request.body.startTime));
        rangeDates.push(new Date(request.body.endTime));
        try{
            const addTVShowToChannel =await this.handler.editChannelToTVShow(channelId,tvshowId,rangeDates);
            return response.send(addTVShowToChannel)
        }catch(error){
            next(error);
        }
        return;
    }

    async searchTVShowsByDate (request: Request, response: Response, next: NextFunction) {
        const channelQuery:ChannelQuery = new ChannelQuery(request.query);
        const _id:ISchema ={
            _id:Types.ObjectId(request.query.channelId)
        }
        try{
            const channels = await this.handler.searchDateRange(_id,channelQuery.mongooseQueryCreator());
            return response.send(channels);
        }catch(error){
            next(error);
        }
        return;
    }
}

export default TVShowController;