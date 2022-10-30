import { Schema, SchemaFactory, Prop} from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Banner {
    @Prop({required: true})
    title: string;
    
    @Prop({required: true})
    sub_title: string;
    
    @Prop()
    image?: string;

    
    @Prop({required: true})
    status: number
}

export type BannerDocument = Banner&Document;

export const BannerSchema = SchemaFactory.createForClass(Banner)