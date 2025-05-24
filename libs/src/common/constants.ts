export const SERVICES = {
  PRODUCTS: {
    name: "PRODUCTS_MICROSERVICE",
    host: "products-microservice",
    port: 3022,
  },
  USERS: {
    name: "USERS_MICROSERVICE",
    host: "users-microservice",
    port: 3020,
  },
  AUTH: {
    name: "AUTH_MICROSERVICE",
    host: "auth-microservice",
    port: 3021,
  },
  ORDERS: {
    name: "ORDERS_MICROSERVICE",
    host: "orders-microservice",
    port: 3023,
  },
  CART: {
    name: "CART_MICROSERVICE",
    host: "cart-microservice",
    port: 3024,
  },
  KAFKA: {
    name: "KAFKA_MICROSERVICE",
    host: "kafka",
    port: 9092,
  },
};
export const USER_PATTERNS = {
  FindAll: "Users.FindAll",
  FindOne: "Users.FindOne",
  FindByEmail: "Users.FindByEmail",
  Create: "Users.Create",
  Update: "Users.Update",
  Remove: "Users.Remove",
};
export const PRODUCTS_PATTERNS = {
  FindAll: "Products.FindAll",
  FindOne: "Products.FindOne",
  Create: "Products.Create",
  Update: "Products.Update",
  Remove: "Products.Remove",
  DecreaseStock: "Products.DecreaseStock",
};

export const AUTH_PATTERNS = {
  login: "Auth.Login",
  verify: "Auth.Verify",
};
export const ORDERS_PATTERNS = {
  FindAll: "Orders.FindAll",
  FindOne: "Orders.FindOne",
  Create: "Orders.Create",
  Update: "Orders.Update",
  Remove: "Orders.Remove",
};
export const CART_PATTERNS = {
  FindOne: "Cart.FindOne",
  addToCart: "Cart.Create",
  Update: "Cart.Update",
  Clear: "Cart.ClearCart",
};
