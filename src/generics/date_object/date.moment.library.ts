import * as moment from 'moment';
import DateObject from './interface/date.object';

class DateMoment implements DateObject{
    isValid(date:Date): boolean {
        return moment(date).isValid();
    }
    now(): Date {
       return moment().toDate();
    }

    createDate(dateString?: any | undefined, format?: any | undefined): Date{
        if(dateString){
            return moment(dateString,format).toDate();
        }
        return new Date(dateString);
        
    }

    isSameOrBefore(date1:Date,date2:Date):number{
        if(moment(date1).isSameOrBefore(date2)){
            return 1;
        }
        return 0;
    }
}

export default DateMoment;