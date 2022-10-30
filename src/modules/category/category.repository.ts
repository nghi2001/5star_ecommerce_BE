import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './entities/Category.entities';
import { Model } from 'mongoose';
import { BaseRepository } from "src/common/base/BaseRepository";
import { createCategoryDTO } from './dto/create-category.dto';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
    constructor(
        @InjectModel(Category.name) CategoryModel: Model<Category>
    ) {
        super(CategoryModel)
    }

    async insertSub(id: string, category: createCategoryDTO) {
        let categorys = await this.model.findById(id);
        await categorys.sub_category.push((category))
        categorys.save()

        return categorys
    }

    async findSub(idParent: string, id: string) {
        let categoryParent = await this.model.findOne({
            _id: idParent,
            sub_category: {
                $elemMatch: {
                    _id: id
                }
            }
        }, {
            name: 1,
            slug: 1,
            "sub_category.$": 1
        });

        return categoryParent
    }

    async deleteSub(idParent: string, id: string) {
        let result = await this.model.findByIdAndUpdate({
            _id: idParent
        },
            {
                $pull: {
                    sub_category: {
                        _id: id
                    }
                }
            }
        );

        return result;
    }

    async updateSub(idParent: string, id: string, category: createCategoryDTO) {
        let result = await this.model.findOneAndUpdate({
            _id: idParent,
            "sub_category._id": id
        },{
            $set: {
                "sub_category.$": category
            }
        },{
            new: true
        })
        return result
    }
}