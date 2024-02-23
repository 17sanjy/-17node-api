const categoryModel = require('../../models/category.model')

const getCategories = async (req, res) => {
    const categories = await categoryModel.find();

    res.json(categories);
}

module.exports = {
    getCategories
}