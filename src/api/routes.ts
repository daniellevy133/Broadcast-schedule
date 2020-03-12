import { Router} from 'express';
//import V1Routes from './v1/v1.routes';
import TVShowController from './controllers/TVShows.controller';
import ChannelController from './controllers/Channel.controller';



class ApiRoutes {
    public router = Router();

    constructor() {
      this.initializeRoutes();
    }

    private initializeRoutes() {
      const TVShowControlle = new TVShowController();
      const ChannelControlle = new ChannelController();
      this.router.use('/tvshows/', TVShowControlle.router);
      this.router.use('/channels/', ChannelControlle.router);
    }

}

export default ApiRoutes;
