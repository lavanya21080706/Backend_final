const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const { findById } = require("../models/user");

router.post("/productpost",async(req,res)=>{
    try {
        const { headphone_type, company, color, price,rating,about,available,ProductName,Images,product_description} = req.body;
        if(!headphone_type || !company|| !color|| !price||!rating||!about||!available||!ProductName||!Images||!product_description)
        {
            return res.status(400).json({
                errorMessage: "Bad Request",
              });
        }
        const Productimage=Images.split(',');
        const ProductData = new Product({
            headphone_type, company, color, price,rating,about,available,ProductName,Images:Productimage,product_description
          });
      
          const ProductResponse = await ProductData.save();
          res.json({
            message: "Product stored successfully",
            success: true,
          });
    } catch (error) {
        console.log(err);
        
    }
})





router.get('/getdata', async (req, res) => {
  try {
    // Extract query parameters from the request
    const { headphone_type, company, color, price, sort, Productsearch } = req.query;

    // Log the value of Productsearch
    console.log('ProductName:', Productsearch);

    // Initialize filter object
    const filter = {};

    // Apply filters based on query parameters
    if (headphone_type) filter.headphone_type = headphone_type;
    if (company) filter.company = company;
    if (color) filter.color = color;

    // Filter by price range
    if (price) {
      switch (price) {
        case '1':
          filter.price = { $gte: 0, $lte: 1000 };
          break;
        case '2':
          filter.price = { $gte: 1000, $lte: 10000 };
          break;
        case '3':
          filter.price = { $gte: 10000, $lte: 20000 };
          break;
        default:
          // Handle invalid price range option
          break;
      }
    }

    // Check if Productsearch is provided for search
    if (Productsearch) {
      const regex = new RegExp(Productsearch, 'i');
      // Apply ProductName filter for search
      filter.ProductName = regex;
    }

    // Find data based on the constructed filter
    let data;
    if (Object.keys(filter).length === 0) {
      // No filter applied, fetch all data
      data = await Product.find();
    } else {
      // Filtered data
      data = await Product.find(filter);
    }

    // Apply sorting if requested
    if (sort) {
      switch (sort) {
        case 'Lowest':
          data = data.sort((a, b) => a.price - b.price);
          break;
        case 'Highest':
          data = data.sort((a, b) => b.price - a.price);
          break;
        case 'A-Z':
          data = data.sort((a, b) => a.ProductName.localeCompare(b.ProductName));
          break;
        case 'Z-A':
          data = data.sort((a, b) => b.ProductName.localeCompare(a.ProductName));
          break;
        default:
          // Default sorting
          break;
      }
    }

    // Send back the filtered and sorted data as a JSON response
    res.status(200).json({
      message: "Data retrieved successfully",
      data
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error retrieving data" });
  }
});
router.get('/count', async (req, res) => {
  try {
    // Count quantity where CardStatus is true
    const cardStatusQuantityCount = await Product.find({ CardStatus: 'true' }).select('Quantity');

    // Summing up the quantities
    let totalQuantity = 0;
    cardStatusQuantityCount.forEach(product => {
      totalQuantity += product.Quantity;
    });

    res.status(200).json({
      message: "Quantity counts retrieved successfully",
      cardStatusQuantity: totalQuantity
    });
  } catch (error) {
    console.error('Error counting quantities:', error);
    res.status(500).json({ message: "Error counting quantities" });
  }
});


router.put('/increment/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    // If product is not found, return 404
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Increment the quantity by 1
    product.Quantity += 1;

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: "Quantity updated successfully",
      newQuantity: product.Quantity
    });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: "Error updating quantity" });
  }
});
router.put('/updateDeliveryStatus/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    // If product is not found, return 404
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the delivery field to true
    product.delivery = true;

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: "Delivery status updated successfully",
      updatedProduct: product
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ message: "Error updating delivery status" });
  }
});


router.put('/updateCardStatus/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    // If product is not found, return 404
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the cardStatus field to true
    product.CardStatus = true;

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: "Card status updated successfully",
      updatedProduct: product
    });
  } catch (error) {
    console.error('Error updating card status:', error);
    res.status(500).json({ message: "Error updating card status" });
  }
});
router.get('/products/cardstatus', async (req, res) => {
  try {
    const products = await Product.find({ CardStatus: true });
    res.json(products);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get('/products/deliverystatus', async (req, res) => {
  try {
    const products = await Product.find({ delivery: true });
    res.json(products);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.put('/quantityupdate/:id', async (req, res) => {
  const productId = req.params.id;
  const newQuantity = req.body.quantity; // Assuming the quantity is sent in the request body

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    // If product is not found, return 404
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the quantity
    product.Quantity = newQuantity;

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: "Quantity updated successfully",
      newQuantity: product.Quantity
    });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: "Error updating quantity" });
  }
});

router.put('/updateall', async (req, res) => {
  try {
    // Update all documents in the collection
        await Product.updateMany({}, {
      CardStatus: false,
      Quantity: 0,
      delivery: false
    });

 
    res.status(200).json({ message: "All documents updated successfully" });
  } catch (error) {
    console.error('Error updating all documents:', error);
    res.status(500).json({ message: "Error updating all documents" });
  }
});

module.exports = router;