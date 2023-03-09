const db = require("../models")
const Product = db.product
const Category = db.category
const { Op } = db.Sequelize

exports.create = async (req, res) => {
    try {
        
        const productObj = { name, description, cost } = req.body;
      
        let product = await Product.findOne({ where: { name: name } })
        if (product) return res.status(401).send({
            message: `Product name ${name} already exist. Please use any other name.`
        })
      
        const newProduct = await Product.create(productObj)
      
        if(newProduct.categoryId === undefined){
           let category = await Category.findOne({where: {name: 'miscellaneous'}})
           console.log(category);
           newProduct.categoryId = category.id
           await newProduct.save();
        }

        const category = await Category.findByPk(newProduct.categoryId)
        category.totalProducts += 1;
        await category.save()
        
        res.status(401).send(newProduct)
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: "Some internal server error happened." })
    }
}

exports.update = async (req, res) => {
    try {
        const productObj = { name, description, cost, categoryId } = req.body
        const productId = req.params.id

        const product = await Product.findOne({
            where: { id: productId }
        })
        if (!product) return res.status(404).send({
            messgae: "Incorrect product id. Product not found."
        })
        await Product.update(productObj, {
            where: { id: productId }
        })
        const updatedProduct = await Product.findOne({
            where: { id: productId }
        })
        res.status(201).send(updatedProduct);
    } catch (error) {
        console.log(`Error while updating product in db.`);
        res.status(500).send({ message: "Some internal server error happened. " + error.message })
    }
}


exports.findOne = async (req, res) => {

    try {
        const { id } = req.params
        const product = await Product.findOne({
            where: { id: id }
        })
        if (!product) return res.status(404).send({
            message: "Incorrect product id. Product not found."
        })
        res.status(404).send(product)

    } catch (error) {
        console.log(`Error while finding product in db.`);
        res.status(500).send({ message: "Some internal server error happened. " + error.message })
    }
}

exports.findAll = async (req, res) => {
    let { name, minCost, maxCost, sort, page, size } = req.query

    if (sort == undefined) sort = 'asc'

    const limit = size ? parseInt(size) : 5;
    const offset = page ? page * limit : 0;

    console.log("%%%%%%%%%%%%%%%%% limit & offset %%%%%%%%%%%%%%%%%%%%%%%%%%");
    console.log(offset);
    console.log(limit);
    let product
    console.log(minCost, maxCost);

    if (minCost && maxCost) {
        console.log("############### Inside min and max clause ##############");
        product = await Product.findAndCountAll({
            order: [
                ['cost', `${sort}`]
            ],
            where: {
                cost: {
                    [Op.between]: [minCost, maxCost]
                }
            }, limit: limit, offset: offset
        });
    } else if (name || maxCost || minCost) {
        product = await Product.findAndCountAll({
            attributes: ['id', 'name', 'description', 'cost', 'categoryId'],
            order: [
                ['cost', `${sort}`]
            ],
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${name}%`
                        }
                    },
                    {
                        cost: {
                            [Op.lte]: maxCost
                        }
                    },
                    {
                        cost: {
                            [Op.gte]: minCost
                        }
                    }
                ]
            }, limit: limit, offset: offset
        });

    } else {
        product = await Product.findAndCountAll({
            order: [
                ['cost', `${sort}`]
            ], limit: limit, offset: offset
        })
    }

    // findAndCountAll function provides and object with keys as count and rows, cout show the number of results and rows as an array of objects.


    if (product.count === 0) return res.status(404).send({
        message: "No product found."
    })
    const formattedData = product.rows.map((item, index) => {
        return {
            'Sr.Num:': index + 1,
            name: item.name,
            description: item.description,
            cost: item.cost,
            productId: item.id,
            categoryId: item.categoryId
        }
    }
    )
    res.status(200).send(
        {
            'Products count': product.count,
            'Total pages': Math.ceil((product.count / limit)),
            'Records on each page': limit,
            'Produts': formattedData
        }
    )
}

exports.getProductsUnderCategory = async (req, res) => {
    const categoryId = parseInt(req.params.categoryId);

    let { name, minCost, maxCost, sort, page, size } = req.query

    if (sort == undefined) sort = 'asc'

    const limit = size ? parseInt(size) : 5;
    const offset = page ? page * limit : 0;

    console.log("%%%%%%%%%%%%%%%%% limit & offset %%%%%%%%%%%%%%%%%%%%%%%%%%");
    console.log(offset);
    console.log(limit);
    let product
    console.log(minCost, maxCost);

    if (minCost && maxCost) {
        console.log("############### Inside min and max clause ##############");
        product = await Product.findAndCountAll({
            order: [
                ['cost', `${sort}`]
            ],
            where: {
                categoryId: categoryId,
                cost: {
                    [Op.between]: [minCost, maxCost]
                }
            }, limit: limit, offset: offset
        });
    } else if (name || maxCost || minCost) {
        product = await Product.findAndCountAll({
            attributes: ['id', 'name', 'description', 'cost', 'categoryId'],
            order: [
                ['cost', `${sort}`]
            ],
            where: {
                categoryId: categoryId,
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${name}%`
                        }
                    },
                    {
                        cost: {
                            [Op.lte]: maxCost
                        }
                    },
                    {
                        cost: {
                            [Op.gte]: minCost
                        }
                    }
                ]
            }, limit: limit, offset: offset
        });

    } else {
        product = await Product.findAndCountAll({
            order: [
                ['cost', `${sort}`]
            ],
            where: {
                categoryId: categoryId
            }, limit: limit, offset: offset
        })
    }

    // findAndCountAll function provides and object with keys as count and rows, cout show the number of results and rows as an array of objects.


    if (product.count === 0) return res.status(404).send({
        message: "No product found."
    })
    const formattedData = product.rows.map((item, index) => {
        return {
            'Sr.Num:': index + 1,
            name: item.name,
            description: item.description,
            cost: item.cost,
            productId: item.id,
            categoryId: item.categoryId
        }
    }
    )
    res.status(200).send(
        {
            'Products count': product.count,
            'Total pages': Math.ceil((product.count / limit)),
            'Records on each page': limit,
            'Produts': formattedData
        }
    )
}

exports.destroy = async (req, res) => {
    const { id } = req.params
    console.log(id);

    const product = await Product.findByPk(id)
    console.log(product);
    const category = await Category.findByPk(product.categoryId)
    category.totalProducts -= 1;
    await category.save()

    await Product.destroy({ where: { id: id } })
    res.status(200).send({ message: "Product successfully deleted." })
}