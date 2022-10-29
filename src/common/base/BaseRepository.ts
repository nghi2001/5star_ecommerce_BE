import { Injectable } from "@nestjs/common";
import { Model, FilterQuery } from "mongoose";
import { IRead } from "./interfaces/IRead.interface";
import { IWrite } from "./interfaces/IWrite.interface";
import mongoose from 'mongoose'


export abstract class BaseRepository <T> implements IRead<T>,IWrite<T> {
    constructor(
        protected readonly model: Model<T>
    ) {
        
    }
    async findById(id: mongoose.Types.ObjectId): Promise<T> {
        let data = await this.model.findById(id);
        return data
    }
    async find(FilterQuery: FilterQuery<T>): Promise<T[]> {
        let data = await this.model.find(FilterQuery)
        return data
    }
    async findOne(FilterQuery: FilterQuery<T>): Promise<T> {
        let data = await this.model.findOne(FilterQuery)
        return data
    }
    async create(item: T): Promise<boolean> {
        try {
            let data = await this.model.create(item)
            return true
        } catch (error) {
            return false
        }
    }
    async update(id: mongoose.Types.ObjectId,update): Promise<boolean> {
        let data = await this.model.updateOne({id: id},update)
        return true
    }
    
    async delete(id: mongoose.Types.ObjectId): Promise<boolean> {
        try {
            let data = await this.model.findByIdAndDelete(id)
            return true
        } catch (error) {
            return false
        }
    }
}