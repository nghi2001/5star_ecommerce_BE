import { FilterQuery} from "mongoose"
export interface IRead <T> {
    find(FilterQuery: FilterQuery<T>): Promise<T[]>;
    findOne(FilterQuery: FilterQuery<T>): Promise<T>;
    findById(id: any): Promise<T>
}