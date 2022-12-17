import { TYPE_ORDER } from "../enum";

export const orderBy = (query, constraintColumn) => {
    let column = query.orderBy || "id";
    let type = query.orderType || TYPE_ORDER.ASC;
    if (constraintColumn[column]) {
        let order = {};
        order[column] = type;
        return order
    }
    return {}
}