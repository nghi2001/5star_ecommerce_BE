import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SubCategory {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    slug: string;
    @Prop({ required: true })
    status: number;
};

const SubCategorySchema = SchemaFactory.createForClass(SubCategory);

@Schema()
export class Category {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    slug: string;
    @Prop({ required: true })
    status: number;

    @Prop({ required: false, type: [SubCategorySchema] })
    sub_category?: (SubCategory)[];
}

export type CategoryDocument = Category & Document;

export const CategorySchema = SchemaFactory.createForClass(Category)