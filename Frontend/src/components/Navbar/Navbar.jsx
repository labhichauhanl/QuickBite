import { useContext, useState } from "react";
import style from "../Navbar/navbar.module.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import {
    Search,
    ShoppingBasket,
    UserRound,
    ShoppingBag,
    LogOut
} from "lucide-react";

const Navbar = ({ setShowLogin }) => {
  // useState used here for menu
  const [menu, setMenu] = useState("home");

  const { getTotalCartAmount, token, setToken } = useContext(StoreContext)

  const navigate = useNavigate()
  const Logout = () => {
    localStorage.removeItem("token")
    setToken("")
    navigate("/")
  }

  return (
    <div className={style.Navbar}>
      <Link to="/"><img src={assets.logo} className={style.logo} /></Link>
      <ul className={style.navbarMenu}>
        {/* If menu === home , classname will be active and similarly for others */}
        <Link
          to="/"
          className={menu === "home" ? style.active : ""}
          onClick={() => setMenu("home")}
        >
          Home
        </Link>
        <a
          href="#ExploreMenu"
          className={menu === "menu" ? style.active : ""}
          onClick={() => setMenu("menu")}
        >
          {" "}
          Menu
        </a>
        <a
          href="#AppDownload"
          className={menu === "mobile-app" ? style.active : ""}
          onClick={() => setMenu("mobile-app")}
        >
          Mobile-app
        </a>
        <a
          href="#Footer"
          className={menu === "contact-us" ? style.active : ""}
          onClick={() => setMenu("contact-us")}
        >
          Contact us
        </a>
      </ul>

      <div className={style.navbarRight}>

        {/* Search */}
        <Search
          className={style.navIcon}
          size={27}
          strokeWidth={1.8}
        />

        {/* Cart */}
        <div className={style.cartIcon}>
          <Link to="/cart">
            <ShoppingBasket
              className={style.navIcon}
              size={27}
              strokeWidth={1.8}
            />
          </Link>

          {getTotalCartAmount() > 0 && (
            <span className={style.cartBadge}>
              {getTotalCartAmount()}
            </span>
          )}
        </div>

        {/* Profile */}
        {!token ? (
          <button
            className={style.signInButton}
            onClick={() => setShowLogin(true)}
          >
            Sign in
          </button>
        ) : (
          <div className={style.navbarProfile}>
            <UserRound
              className={style.navIcon}
              size={28}
              strokeWidth={1.8}
            />

            <ul className={style.navProfileDropdown}>

              <li onClick={() => navigate("/myorders")}>
                <ShoppingBag size={19} strokeWidth={1.8} />
                <p>Orders</p>
              </li>

              <hr />

              <li onClick={Logout}>
                <LogOut size={19} strokeWidth={1.8} />
                <p>Logout</p>
              </li>

            </ul>
          </div>
        )}

      </div>

    </div>
  );
};

export default Navbar;
