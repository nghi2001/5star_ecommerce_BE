import { ObjectId } from 'mongoose'
export interface IWrite <T> {
    create(item: T) : Promise<boolean>
    update(id: any): Promise<boolean>
    delete(id: any): Promise<boolean>
}