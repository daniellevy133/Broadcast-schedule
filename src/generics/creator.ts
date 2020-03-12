import DateMoment from './date_object/date.moment.library';
import DateObject from './date_object/interface/date.object';

export default class Creator{

    static createDateObject(className:string):DateObject{
        switch(className){
            case('dateMoment'):{
                return new DateMoment();
            }
            default:{
                throw 'didnt fined data object'
            }
        }
    }

}