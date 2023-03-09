const db = require("../models")
const Category = db.category
const { Op } = db.Sequelize

exports.create = async (req, res) => {
    try {
        const categoryObj = { name, description } = req.body
        const category = await Category.findAll({ where: { name: name } })
        console.log(category);
        if (category.length) {
            return res.status(401).send({
                message: `Category with ${name}  already exist.`
            })
        }
        const newCategory = await Category.create(categoryObj)
        return res.status(201).send({
            message: `A new category with name [ ${newCategory.name} ] successfully created.`
        })
        
    } catch (error) {
        console.log("Category update error \n" + error.message);
        return res.status(500).send({
            message: `Internal server error wile updating the category.`
        })
    }
}

exports.findAll = async (req, res) => {
    try {
        const { name, description } = req.query
        console.log(name, description);
        let category
        if (name || description) {
            category = await Category.findAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: `%${name}%`
                            }
                        },
                        {
                            description: {
                                [Op.like]: `%${description}%`
                            }
                        }
                    ]
                }
            });

            if (!category.length) return res.status(404).send({
                message: "Categroy not found."
            })

        } else {
            category = await Category.findAll()
            if (!category.length) return res.status(404).send({
                message: "Categroy not found."
            })
        }
        res.status(200).send(category)
    } catch (error) {
        console.log("Category findAll error \n" + error.message);
        res.status(500).send({
            message: `Internal server error while finding the category.`
        })
    }
}
exports.findOne = async (req, res) => {

    try {
        const categoryId  = req.params.id
        const cateory = await Category.findByPk(categoryId)
        if (!cateory) return res.status(401).send({
            message: `Categroy with Id [${categoryId} ] not found`
        })
        res.status(200).send(cateory)
    } catch (error) {
        console.log("Category find one error \n" + error.message);
        res.status(500).send({
            message: `Internal server error while finding the category.`
        })
    }
}

exports.update = async (req, res) => {

    try {
        const catObj = { name, description } = req.body
        const categoryId = req.params.id

        const category = await Category.findOne({ where: { id: categoryId } })
        console.log(category);
        if (!category) return res.status(404).send({
            message: "Category not found."
        })
        await Category.update(catObj, {
            where: { id: categoryId },
            returnning: true
        })
        res.status(201).send({ message: `Categroy id [ ${categoryId} ] successfully updated.` })
    } catch (error) {
        console.log("Category update error \n" + error.message);
        res.status(500).send({
            message: `Internal server error while updating the category.`
        })
    }
}

exports.destroy = async (req, res) => {

    try {
        const  categoryId = req.params.id;
        const category = await Category.findByPk(categoryId)
        if (!category) return res.status(404).send({
            message: "No category found with Id " + categoryId
        })
        await Category.destroy({ where: { id: categoryId } })
        res.status(200).send({ messge: "Category successfully deleted from database." })
    } catch (error) {
        console.log("Category deletion error \n" + error.message);
        res.status(500).send({
            message: `Internal server error while deleting the category.`
        })
    }
}