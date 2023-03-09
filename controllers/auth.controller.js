const db = require("../models")
const User = db.user
const Role = db.role
const { Op } = db.Sequelize
const Sequelize = db.Sequelize
const { compareSync } = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.signup = async (req, res) => {
    const userObj = { username, email, password, } = req.body
    try {
        const user = await User.create(userObj);
        if (req.body.roles) {
            const userRoles = await Role.findAll({
                where: {
                    name: { [Op.or]: req.body.roles }
                }
            })
            console.log(userRoles);
            await user.setRoles(userRoles)
            
            await countUsersByRole()

            res.status(201).send({ message: "User ceated successfully." })
        } else {
            const userRoles = await Role.findAll({ where: { name: "customer" } })
            await user.setRoles(userRoles)
            
            await countUsersByRole()
            
            res.status(201).send({ message: "User ceated successfully." })
        }

    } catch (error) {
        return res.status(500).send({ message: "Some internal error while signup.\n" + error.message })
    }
}


async function countUsersByRole() {
    try {
        const result = await Role.findAll({
            attributes: ['name', [Sequelize.fn('COUNT', Sequelize.col('users.id')), 'userCount']],
            include: [{
                model: User,
                attributes: [],
                through: { attributes: [] }
            }],
            group: ['Role.id'],
            order: [[Sequelize.literal('userCount'), 'DESC']]
        });
        console.log("Result", result);

        let countArray = result.map(role => ({
            name: role.name,
            userCount: role.get('userCount')
        }));
        for (let i = 0; i < countArray.length; i++) {
            let role = await db.role.findOne({ where: { name: countArray[i].name } })
            role.totalUsers = countArray[i].userCount
            role.save();
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error counting users by role');
    }
}


exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email: email } })
        if (!user) return res.status(401).send({
            message: "User not found."
        })

        const isPasswordValid = compareSync(password, user.password)
        if (!isPasswordValid) return res.status(401).send({
            message: "Incorrect password."
        })
        const userRoles = await user.getRoles()
        const authorities = [];
        userRoles.forEach(role => {
            authorities.push(role.name)
        });
        console.log(authorities);

        const token = jwt.sign(
            { id: user.id },
            process.env.SECRET,
            { expiresIn: '24h' }
        )

        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token
        })

    } catch (error) {
        res.status(500).send({ message: "Some internal error in signin. " + error.message })
    }
}