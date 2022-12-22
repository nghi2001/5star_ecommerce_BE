import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Product } from "../../entity/product.entity";

@Injectable()
export class ProductRepository extends Repository<Product> {
    constructor(dataSource: DataSource) {
        super(Product, dataSource.createEntityManager())
    }

    async createProduct(product) {
        let result = await this.createQueryBuilder()
            .insert()
            .into(Product)
            .values([product])
            .execute()
        return result
    }

    async getOneProduct(id: number) {
        let product = await this.createQueryBuilder("product")
            .leftJoin("product.stocks", 'stock')
            .where("product.id = :id", { id: id })
            .leftJoin("product.images", "images")
            .select([
                'product.id',
                'product.name',
                'product.description',
                'images',
                'product.slug',
                'product.sold',
                'product.status',
                'product.views',
                'product.id_category',
                'product.id_brand',
                'product.create_at',
                'product.info_detail',
                'stock.id',
                'stock.price',
                'stock.quantity',
                'stock.id_classify_1',
                'stock.id_classify_2',
                "classify_1.attribute",
                "classify_2.attribute"
            ])
            .leftJoin("stock.classify_1", "classify_1")
            .leftJoin("stock.classify_2", "classify_2")
            .getOne()
        return product
    }

    async getOneProductBySlug(slug: string) {
        let product = await this.createQueryBuilder("product")
            .leftJoin("product.stocks", 'stock')
            .where("product.slug = :slug", { slug: slug })
            .leftJoin("product.images", "images")
            .select([
                'product.id',
                'product.name',
                'product.description',
                'images',
                'product.slug',
                'product.sold',
                'product.status',
                'product.views',
                'product.id_category',
                'product.id_brand',
                'product.create_at',
                'product.info_detail',
                'stock.id',
                'stock.price',
                'stock.quantity',
                'stock.id_classify_1',
                'stock.id_classify_2',
                "classify_1.attribute",
                "classify_2.attribute"
            ])
            .leftJoin("stock.classify_1", "classify_1")
            .leftJoin("stock.classify_2", "classify_2")
            .getOne()
        return product
    }
    async getManyProduct() {
        let product = await this.createQueryBuilder("product")
            .leftJoin("product.stocks", 'stock')
            .select([
                'product.id',
                'product.name',
                'product.description',
                'product.slug',
                'product.sold',
                'product.status',
                'product.views',
                'product.id_category',
                'product.id_brand',
                'product.create_at',
                'product.info_detail',
                'stock.id',
                'stock.price',
                'stock.quantity',
                'stock.id_classify_1',
                'stock.id_classify_2',
                "classify_1.attribute",
                "classify_2.attribute",
                "images"
            ])
            .leftJoin("stock.classify_1", "classify_1")
            .leftJoin("stock.classify_2", "classify_2")
            .leftJoin("product.images", "images")
            .getMany()
        return product
    }

    async getList(filter = {}, paginaton = {}, sort = {}) {
        let query = await this.createQueryBuilder("product")
            .leftJoin("product.stocks", 'stock')
            .leftJoin("stock.classify_1", "classify_1")
            .leftJoin("stock.classify_2", "classify_2")
            .leftJoin("product.images", "images")
            .select([
                'product.id',
                'product.name',
                'product.description',
                'product.slug',
                'product.sold',
                'product.status',
                'product.views',
                'product.id_category',
                'product.id_brand',
                'product.create_at',
                'product.info_detail',
                'stock.id',
                'stock.price',
                'stock.quantity',
                'stock.id_classify_1',
                'stock.id_classify_2',
                "classify_1.attribute",
                "classify_2.attribute",
                "images"
            ])
        Object.keys(filter).forEach((key) => {
            if (filter[key]) {
                let value: any = {};
                value[`${key}`] = filter[key]

                if (key == 'product.name') {
                    query.andWhere(`similarity(unaccent(${key}), unaccent(:${key})) > 0.1`, value)
                }
                else if (key == 'stock.price') {
                    if (filter[key]['raw']) {
                        query.andWhere(filter[key]['raw'], filter[key]['value'])
                    } else {
                        value[key] = filter[key].value;
                        query.andWhere(`${key} ${filter[key].operator} :${key}`, value)
                    }
                }
                else {
                    query.andWhere(`${key} = :${key}`, value)
                }
            }
        })
        let total = await query.getCount();
        let data = await query.getMany();
        // let data = await this.find({
        //     where: filter,
        //     relations: {
        //         stocks: {
        //             classify_1: true,
        //             classify_2: true
        //         },
        //         images: true
        //     },
        //     order: sort,
        //     ...paginaton
        // })
        // let total = await this.count({
        //     where: filter
        // })
        return {
            total,
            data
        }
    }

    async checkproductExist(idProduct: number) {
        let data = await this.findOne({
            where: {
                id: idProduct
            },
            relations: {
                stocks: true
            },
            select: {
                stocks: {
                    id: true
                }
            }
        })
        return data;
    }
}