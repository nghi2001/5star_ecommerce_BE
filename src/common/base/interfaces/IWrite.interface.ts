import { ObjectId } from 'mongoose'
export interface IWrite <T> {
    create(item: T) : Promise<boolean>
    update(id: ObjectId): Promise<boolean>
    delete(id: ObjectId): Promise<boolean>
}