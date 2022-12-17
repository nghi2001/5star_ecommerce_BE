import { BLOG_STATUS } from "src/common/enum";

export interface Blog {
    id?: number;
    title?: string;
    content?: string;
    image?: string;
    slug?: string;
    status?: BLOG_STATUS
}