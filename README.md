# ShopHub - E-Commerce Demo

A large-scale static e-commerce website built with vanilla **HTML**, **CSS**, and **JavaScript** - no frameworks, no backend, no build tools.

> **⚠️ IMPORTANT**: This application uses ES6 modules and **must be served via a local web server** (see [How to Run](#-how-to-run) section). Opening `index.html` directly with `file://` will not work due to browser security restrictions.

## 🚀 Features

### Data & Content
- **12 Product Categories**: Electronics, Mobile Phones, Laptops, Home Appliances, Fashion, Shoes, Accessories, Books, Gaming, Sports, Beauty, and Grocery
- **80 Products**: Each with real images from Unsplash, detailed descriptions, ratings, pricing, and stock information
- **Real Images**: All product and category images are from Unsplash/Pexels

### Pages
1. **Home** - Hero section, featured products, new arrivals, category showcase
2. **Products** - All products with filtering and sorting
3. **Category** - Category-specific product listing
4. **Product Details** - Individual product view with quantity selector
5. **Cart** - Shopping cart with item management
6. **Checkout** - Address selection and order placement
7. **Orders** - Order history with status-based actions
8. **Login** - Authentication page
9. **Signup** - Registration page (demo mode)
10. **Profile** - User profile and settings
11. **Addresses** - Address management
12. **About** - About page
13. **404** - Error page

### Functionality
- ✅ **Authentication**: Login with hardcoded credentials
- ✅ **Search & Filter**: Live search, category filter, price range filter
- ✅ **Shopping Cart**: Add, update quantity, remove items
- ✅ **Orders**: Create orders, view history, cancel/return with status rules
- ✅ **Profile**: Update name, manage delivery addresses
- ✅ **LocalStorage**: All data persists in browser

### Order Management Rules
- **PENDING** → Can cancel
- **SHIPPED** → No actions available
- **DELIVERED** → Can return
- **CANCELLED** → No actions available
- **RETURNED** → No actions available

## 🎨 Design

- **Modern Dark Theme** with vibrant gradients
- **Glassmorphism** effects on cards
- **Smooth animations** and hover effects
- **Responsive design** (mobile, tablet, desktop)
- **Google Fonts**: Inter & Outfit
- **Color Palette**: Purple/pink gradients with modern aesthetics

## 📁 Project Structure

```
haythm/
├── index.html                      # Home page
├── css/
│   ├── global.css                  # Design system & variables
│   ├── components.css              # Reusable components
│   └── pages.css                   # Page-specific styles
├── js/
│   ├── data/
│   │   ├── categories.js          # 12 categories
│   │   ├── products.js            # 80 products
│   │   ├── user.js                # Hardcoded user
│   │   └── constants.js            # Config & enums
│   ├── services/
│   │   ├── storage.service.js     # localStorage wrapper
│   │   ├── auth.service.js        # Authentication
│   │   ├── cart.service.js        # Shopping cart
│   │   ├── order.service.js       # Order management
│   │   └── profile.service.js     # Profile & addresses
│   ├── utils/
│   │   ├── helpers.js             # Utility functions
│   │   └── filters.js             # Search & filter logic
│   ├── components/
│   │   ├── navbar.js              # Navigation bar
│   │   └── product-card.js        # Product card
│   └── pages/
│       ├── home.js
│       ├── products.js
│       ├── product-details.js
│       ├── cart.js
│       ├── checkout.js
│       ├── orders.js
│       ├── profile.js
│       ├── login.js
│       └── category.js
└── pages/
    ├── products.html
    ├── product-details.html
    ├── cart.html
    ├── checkout.html
    ├── orders.html
    ├── profile.html
    ├── login.html
    ├── signup.html
    ├── category.html
    ├── about.html
    └── 404.html
```

## 🚀 How to Run

1. Open `index.html` in your web browser
2. That's it! No installation, no dependencies, no build process

**Recommended**: Use a local web server for best results:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

Then open `http://localhost:8000` in your browser.

## 💾 Data Storage

All data is stored in **localStorage**:
- `ecommerce_session` - User session
- `ecommerce_cart` - Shopping cart
- `ecommerce_orders` - Order history
- `ecommerce_user_data` - User profile & addresses

## 🎯 Key Implementation Details

### Clean Code Structure
- **Separation of concerns**: Data, logic, and UI are clearly separated
- **Service layer**: Business logic in dedicated service modules
- **Reusable components**: Navbar and product cards are modular
- **Utility functions**: Common functions in helper modules

### No Inline JavaScript
- All JavaScript in separate `.js` files
- Module-based architecture using ES6 modules
- Event listeners attached programmatically

### Modern CSS
- CSS custom properties (variables)
- CSS Grid and Flexbox
- Mobile-first responsive design
- Smooth transitions and animations

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

## 🌟 Highlights

- Clean, modern, and premium UI design
- Fully functional e-commerce flow
- Real product images
- Comprehensive filtering and search
- Order management with status workflows
- Profile and address management
- All features work offline (after first load)
- No frameworks - pure vanilla JavaScript
- Classroom-ready code structure

## 📝 Notes

- This is a **demo application** with hardcoded authentication
- No real payment processing
- All data is stored locally in the browser
- Clear browser data to reset the application

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**
