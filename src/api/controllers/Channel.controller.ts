import CrudController from '../../generics/baseCrud.controller';
import {ChannelModel} from '../../db/models/channel.model';

class ChannelController extends CrudController{


    protected initializeRoutes(): void {
        this.router.get('/',this.getAll.bind(this));
    }    
    protected getSchema(): import("mongoose").Model<any, {}> {
        return ChannelModel;
    }
}

export default ChannelController;