import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Product } from "src/entity/product.entity";

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
            .select([
                'product.id',
                'product.name',
                'product.description',
                'product.image',
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
                'product.image',
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
            .getMany()
        return product
    }
}