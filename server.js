const express = require("express")
const app = express();
const bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("dotenv").config()
const { log } = require("console")
const roleData = require("./seedData/roleData.json")
const productData = require("./seedData/productData.json")
const categoryData = require("./seedData/categoryData.json")
const userData = require("./seedData/userData.json")
const db = require("./models");
const Sequelize = db.Sequelize
const { Op } = Sequelize
const { findAll } = require("./controllers/category.controller");



db.sequelize.sync({ force: true }).then(() => {
  log("DB Synced with models.")
  init();
})

async function init() {

  await db.role.bulkCreate(roleData)
  log("########### Initial Roles created ###########")

  await db.category.bulkCreate(categoryData)
  log("########### Initial Categories created ###########")

  await db.product.bulkCreate(productData)
  log("########### Initial Products created ###########")

  const createdUsers = await db.user.bulkCreate(userData)
  log("########### Initial users created ###########")
  //log(createdUsers)


  //Assigning roles to the users;
  for (let i = 0; i < createdUsers.length; i++) {
    log("userData####################################")
    log(userData[i].roles);
    const userRoles = await db.role.findAll({
      where: {
        name: { [Op.or]: userData[i].roles }
      }
    })
    await createdUsers[i].setRoles(userRoles);
    console.log("userRoles_+++++++++++++++++++====================");
    console.log(userRoles);
  }
  let countArray =  await countUsersByRole()
  log(countArray, "countArraycountArraycountArraycountArray")
  for(let i = 0; i<countArray.length; i++){
    let role = await db.role.findOne({where:{name: countArray[i].name}})
    role.totalUsers = countArray[i].userCount
    role.save();
  }

  const categories = await db.category.findAll()
  for (let index = 0; index < categories.length; index++) {
    let products = await db.product.findAll({ where: { categoryId: categories[index].id } })
    categories[index].totalProducts = products.length
    await categories[index].save()
  }
}



async function countUsersByRole() {
  try {
    const result = await db.role.findAll({
      attributes: ['name', [Sequelize.fn('COUNT', Sequelize.col('users.id')), 'userCount']],
      include: [{
        model: db.user,
        attributes: [],
        through: { attributes: [] }
      }],
      group: ['Role.id'],
      order: [[Sequelize.literal('userCount'), 'DESC']]
    });
    log("Result $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n",result)
    let count = result.map(role => ({
      name: role.name,
      userCount: role.get('userCount')
    }));
    console.log("Count::::: ", count);
    return count;
  } catch (error) {
    console.error(error);
    throw new Error('Error counting users by role');
  }
}



require("./routes/auth.route")(app)
require("./routes/category.route")(app)
require("./routes/product.route")(app)
require("./routes/cart.route")(app)

app.listen(process.env.PORT, () => {
  log(`Server is listenting at not port number: ${process.env.PORT}`);
})