import * as moment from 'moment';
import { MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
export const FilterFromToCreate = (create_from, create_to, where) => {
    if (create_from) {
        let dateFrom = new Date(create_from + ' 00:00:00');
        if (!isNaN(dateFrom.getTime())) {
            where.create_at = MoreThanOrEqual(dateFrom)
        }
    }
    if (create_to) {
        let dateTo = new Date(create_from + ' 23:59:59');
        if (!isNaN(dateTo.getTime())) {
            where.create_at = LessThanOrEqual(dateTo)
        }
    }

    if (create_from && create_to) {
        let dateFrom = new Date(create_from + ' 00:00:00');
        let dateTo = new Date(create_to + ' 23:59:59');
        if (!isNaN(dateFrom.getTime()) && !isNaN(dateTo.getTime())) {
            where.create_at = Between(dateFrom, dateTo);
        }
    }
    return where;
}