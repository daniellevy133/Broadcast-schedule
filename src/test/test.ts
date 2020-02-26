import {ChannelModel} from'./channel.model';
import * as mongoose from 'mongoose';
import ISchema from '../generics/baseInterface.interface';

mongoose.connect("mongodb://localhost:27017/broadcastSchedule", () => { })
  .then(() => {
      console.log('Connected to database!');
    })
    .catch(() => {
        console.log('error');
        console.log('Connection to database failed!');
    });
async function test (){
    const tre:ISchema ={_id: mongoose.Types.ObjectId("5e4baf87206019eb88a5483c")}
    const query = new ChannelModel(tre);
    //query.sort({name:-1});
    console.log(query);
}

test();