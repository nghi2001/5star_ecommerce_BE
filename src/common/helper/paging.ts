type Filter = {
    perPage?: number,
    page?: number
}
type Pagination = {
    take?: number,
    skip?: number
}
export const pager = (filters: Filter) => {
    let options: Pagination = {};
    if (filters.perPage && Number(filters.perPage)) {
        options.take = filters.perPage > 100 ? 100 : filters.perPage
    } else {
        options.take = 20;
    }
    if (filters.page > 0) {
        options.skip = filters.page * options.take;
    } else {
        options.skip = 0;
    }
    return options
}