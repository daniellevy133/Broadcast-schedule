
interface DateObject{

    createDate(dateString?:string,format?:string):Date;
    now():Date;
    isValid(date:Date):boolean;
    isSameOrBefore(date1:Date,date2:Date):number;
}

export default DateObject;