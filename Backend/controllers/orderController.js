import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Place user order
const placeOrder = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        if (!userId || !items || items.length === 0 || !address) {
            return res.json({
                success: false,
                message: "Invalid order details"
            });
        }

        /*
         * Calculate the total on the backend instead of trusting
         * the amount sent by the frontend.
         */
        let subtotal = 0;

        for (const item of items) {
            const food = await foodModel.findById(item._id);

            if (!food) {
                return res.json({
                    success: false,
                    message: `Food item not found: ${item.name}`
                });
            }

            subtotal += food.price * item.quantity;
        }

        const deliveryFee = 50;
        const totalAmount = subtotal + deliveryFee;

        // Create order in MongoDB
        const newOrder = new orderModel({
            userId,
            items,
            amount: totalAmount,
            address
        });

        await newOrder.save();

        /*
         * Razorpay expects the amount in the smallest currency unit.
         * For INR:
         * ₹100 = 10000 paise
         */
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: newOrder._id.toString()
        });

        res.json({
            success: true,
            orderId: newOrder._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: error.message
        });
    }
};


// Verify Razorpay payment
const verifyOrder = async (req, res) => {
    try {
        const {
            orderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !orderId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.json({
                success: false,
                message: "Missing payment details"
            });
        }

        // Generate signature using Razorpay secret
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        // Compare signatures
        if (generatedSignature !== razorpay_signature) {
            return res.json({
                success: false,
                message: "Payment verification failed"
            });
        }

        // Mark order as paid
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { payment: true },
            { new: true }
        );

        if (!updatedOrder) {
            return res.json({
                success: false,
                message: "Order not found"
            });
        }

        // Clear user's cart only after successful payment
        await userModel.findByIdAndUpdate(
            updatedOrder.userId,
            { cartData: {} }
        );

        res.json({
            success: true,
            message: "Payment verified successfully"
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: "Payment verification failed"
        });
    }
};


// User orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({
            userId: req.body.userId
        });

        res.json({
            success: true,
            data: orders
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: "Error"
        });
    }
};


// All orders for Admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});

        res.json({
            success: true,
            data: orders
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: "Error"
        });
    }
};


// Update Order Status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(
            req.body.orderId,
            { status: req.body.status }
        );

        res.json({
            success: true,
            message: "Status Updated!"
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: "Error"
        });
    }
};


export {
    placeOrder,
    verifyOrder,
    userOrders,
    updateStatus,
    listOrders
};