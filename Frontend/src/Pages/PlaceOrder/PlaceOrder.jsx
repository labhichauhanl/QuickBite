import { useContext, useEffect, useState } from 'react'
import style from './placeorder.module.css'
import style1 from '../Cart/cart.module.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItem,
    URl
  } = useContext(StoreContext)

  const navigate = useNavigate()
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value

    setData(data => ({
      ...data,
      [name]: value
    }))
  }

  const placeOrder = async (event) => {
    event.preventDefault()

    try {
      let orderItems = []
      food_list.forEach((item) => {
        if (cartItem[item._id] > 0) {

          const itemInfo = {
            ...item,
            quantity: cartItem[item._id]
          }
          orderItems.push(itemInfo)
        }

      })

      const orderData = {
        address: data,
        items: orderItems
      }

      const response = await axios.post(
        URl + "/api/order/place",
        orderData,
        {
          headers: {token}
        }
      )

      if (response.data.success) {

        const options = {
          key: response.data.key,
          amount: response.data.amount,
          currency: response.data.currency,
          name: "QuickBite",
          description: "Food Order Payment",
          order_id: response.data.razorpayOrderId,
          handler: async function (paymentResponse) {

            try {

              const verifyResponse = await axios.post(
                URl + "/api/order/verify",
                {
                  orderId: response.data.orderId,
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature
                },
                {
                  headers: {token}
                }
              )

              if (verifyResponse.data.success) {
                toast.success("Payment successful!")
                navigate("/myorders")
              }
              else {
                toast.error( verifyResponse.data.message || "Payment verification failed")
              }
            } 
            catch (error) {
              console.log(error)
              toast.error("Payment verification failed")
            }
          },

          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone
          },
          theme: {color: "#3399cc"}
        }

        const razorpay = new window.Razorpay(options)
        razorpay.on(
          "payment.failed",
          function (response) {
            console.log(response.error)
            toast.error("Payment failed. Please try again.")
          }
        )
        razorpay.open()
      } 
      else {
        toast.error( response.data.message || "Unable to place order")
      }
    } catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.message ||
        "Something went wrong while placing the order"
      )
    }
  }

  useEffect(() => {

    if (!token) {
      navigate('/cart')
    } 
    else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token, getTotalCartAmount, navigate])


  return (
    
    <form onSubmit={placeOrder} className={style.placeOrder}>

      <div className={style.placeOrderLeft}>
        <p className={style.title}>Delivery Details</p>
        <div className={style.multiInputs}>

          <input
            type="text"
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            placeholder="First Name"
            required
          />

          <input
            type="text"
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            placeholder="Last Name"
            required
          />

        </div>

        <input
          type="email"
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          placeholder="Email Address"
          required
        />

        <input
          type="text"
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          placeholder="Street"
          required
        />

        <div className={style.multiInputs}>

          <input
            type="text"
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            placeholder="City"
            required
          />

          <input
            type="text"
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            placeholder="State"
            required
          />

        </div>

        <div className={style.multiInputs}>

          <input
            type="text"
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            placeholder="Zip Code"
            required
          />

          <input
            type="text"
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            placeholder="Country"
            required
          />

        </div>

        <input
          type="text"
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          placeholder="Phone Number"
          required
          />
      </div>

      <div className={style.placeOrderRight}>
        <div className={style1.CartTotal}>
          <h2>Cart Total</h2>
          <div>

            <div className={style1.CartTotalDetails}>
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>

            <hr />
            <div className={style1.CartTotalDetails}>
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 5}</p>
            </div>
            <hr/>

            <div className={style1.CartTotalDetails}>
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</b>
            </div>
          </div>
          <button type="submit">Proceed To Payment</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder