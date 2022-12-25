import { STATUS_COMMENT } from "src/common/enum";

export type Comment = {
    id?: number;
    body?: string;
    parent_id?: number;
    user_id?: number;
    blog_id?: number;
    status?: STATUS_COMMENT;
}