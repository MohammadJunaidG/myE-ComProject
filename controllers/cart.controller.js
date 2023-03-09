const { Op } = require("sequelize");
const db = require("../models")
const Cart = db.cart
const Product = db.product;
const User = db.user;

exports.create = async (req, res) => {
    try {
        const user = req.user
        const cartId = req.user.id

        
        const cart = await user.createCart({cartId})
        
        await user.setCart(cart)
        
        const userCart = await user.getCart()
        
        console.log("%%%%%%%%%% checking userCart %%%%%%%%%% ");
        console.log(userCart);
        
       
        res.status(201).send({
            cartId: cart.id,
            totalProducts: cart.totalProducts,
            totalCost: cart.totalCost
        })
    } catch (error) {

        console.log(error.message)
        res.status(500).send({message: "Some internal server error."})
    }
}

exports.update = async (req, res) => {
    // const cartId = req.params.id;
    const user = req.user
    console.log(user);
    const userCart = await user.getCart()
    console.log(userCart);

    const cart = await Cart.findByPk(userCart.id)

    const product = await Product.findAll({ where: { id: req.body.products } })
    
    await cart.addProduct(product);
    const cartProducts = await cart.getProducts()

    let selectedProducts = []
    let totalCost = 0, totalProducts = cartProducts.length;

    for (let i = 0; i < cartProducts.length; i++) {
        selectedProducts.push(cartProducts[i])
        totalCost = totalCost + cartProducts[i].cost
    }

    cart.totalCost = totalCost
    cart.totalProducts = totalProducts

    await cart.save();

    const formattedData = {
        message: `Products with id [ ${req.body.products} ] added to the cart successfully.`
    }

    res.status(201).send({
        message: formattedData.message,
        cartId: cart.id,
        totalProducts: totalProducts,
        totalCost: totalCost,
    })
}

exports.findOne = async (req, res) => {
    const cartId = req.params.id;

    const cart = await Cart.findByPk(cartId)
    if (!cart) return res.status(404).send({ message: "No cart found." })
    const productList = await cart.getProducts()

    const formattedData = productList.map((product) => {
        return {
            productId: product.id,
            name: product.name,
            cost: product.cost,
            categoryId: product.categoryId
        }
    })
    res.status(200).send({
        cartId: cart.id,
        totalProducts: cart.totalProducts,
        totalCost: cart.totalCost,
        productList: formattedData
    })
}

exports.deleteCartItem = async (req, res) => {
    const productId = req.params.productId;
    const cartId = req.params.cartId;
    const cart = await Cart.findByPk(cartId)
    console.log(cart);
    const cartProducts = await cart.getProducts({
        where: { id: productId }
    })
    console.log(cartProducts);
    await cartProducts[0].destroy()

    cart.getProducts().then(products => {
        let totalCost = 0
        for (let i = 0; i < products.length; i++) {
            totalCost += products[i].cost
        }
        cart.totalProducts = products.length
        cart.totalCost = totalCost
    }).then(() => {
        cart.save();
    })

    res.status(200).send({
        message: "Product deleted successfully from cart"
    })
}




exports.destroy = async (req, res) => {
    const cartId = req.params.id
    const result = await Cart.destroy({ where: { id: cartId } })
    if (!result) return res.status(404).send({ message: "No cart found." })
    console.log(result);
    res.status(200).send({ message: "Cart deleted successfully." })
}
