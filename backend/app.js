const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// routers
const categoriesRoutes = require('./routes/categories');
const ordersRoutes = require('./routes/orders');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');

require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/errorHandler');

const api = process.env.API_URL;

// middleware
app.use(express.json());
// bug https://youtrack.jetbrains.com/issue/WEB-46292
app.use(morgan('tiny'));
app.use(cors());

//enable pre-flight across-the-board like so:
app.options('*', cors());
app.use(authJwt());
app.use(errorHandler);

// Routers
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

mongoose.connect(
  process.env.CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-database',
  },
  (error) => {
    console.log('Database connection is ready');
    if (error) {
      console.log('database error', error);
    }
  }
);

app.listen(3000, () => {
  console.log('server is running http://localhost:3000');
});
