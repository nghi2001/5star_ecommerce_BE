import {ObjectId, FilterQuery} from "mongoose"
export interface IRead <T> {
    find(FilterQuery: FilterQuery<T>): Promise<T[]>;
    findOne(FilterQuery: FilterQuery<T>): Promise<T>;
    findById(id: ObjectId): Promise<T>
}