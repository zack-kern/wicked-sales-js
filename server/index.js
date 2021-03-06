require('dotenv/config');
const express = require('express');
const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');
const app = express();

app.get('/api/products', (req, res, next) => {
  const sql = `
      select *
      from "products";
    `;
  db.query(sql)
    .then(result => {
      res.status(200);
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.use(staticMiddleware);
app.use(sessionMiddleware);
app.use(express.json());

app.get('/api/products/:productId', (req, res, next) => {
  const prodId = parseInt(req.params.productId);
  const sql = `
    select *
    from "products"
    where "productId" = ${prodId}
  `;
  db.query(sql)
    .then(result => {
      res.status(200);
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/cart', (req, res, next) => {
  if (!req.session.cartId) {
    res.status(200).json([]);
  } else {
    const value = [req.session.cartId];
    const sql = `
        select "c"."cartItemId",
                "c"."price",
                "p"."productId",
                "p"."image",
                "p"."name",
                "p"."shortDescription"
        from "cartItems" as "c"
        join "products" as "p" using ("productId")
        where "c"."cartId" = $1
    `;
    db.query(sql, value)
      .then(result => {
        res.status(200);
        res.json(result.rows);
      })
      .catch(err => next(err));
  }
});

app.post('/api/cart', (req, res, next) => {
  if (parseInt(req.body.productId)) {
    const myVal = [req.body.productId];
    const sql = `
      select "price"
      from "products"
      where "productId" = $1
    `;
    db.query(sql, myVal)
      .then(result => {
        if (result.rows[0]) {
          if (req.session.cartId) {
            const obj = {
              cartId: req.session.cartId,
              price: result.rows[0].price
            };
            return (obj);
          } else if (!req.session.cartId && result.rows.length !== 0) {
            const sql2 = `
            insert into "carts" ("cartId", "createdAt")
            values (default, default)
            returning "cartId"
          `;
            return db.query(sql2)
              .then(ress => {
                const obj = {
                  cartId: ress.rows[0].cartId,
                  price: result.rows[0].price
                };
                return (obj);
              });
          } else {
            throw new ClientError('couldnt get a price for that productId...', 400);
          }
        } else {
          throw new ClientError('couldnt get product with that ID', 400);
        }
      })
      .then(rez => {
        req.session.cartId = rez.cartId;
        const val = [rez.cartId, req.body.productId, rez.price];
        const sql3 = `
          insert into "cartItems" ("cartId", "productId", "price")
          values ($1, $2, $3)
          returning "cartItemId"
        `;
        return db.query(sql3, val);
      })
      .then(ressy => {
        const sql4 = `
          select "c"."cartItemId",
                "c"."price",
                "p"."productId",
                "p"."image",
                "p"."name",
                "p"."shortDescription"
            from "cartItems" as "c"
            join "products" as "p" using ("productId")
          where "c"."cartItemId" = ${ressy.rows[0].cartItemId}
        `;
        return db.query(sql4)
          .then(rezz => {
            res.status(201).json(rezz.rows[0]);
          });
      })
      .catch(err => next(err));
  } else {
    res.status(400).json({ error: 'pick a real product id and try again please' });
  }
});

app.get('/api/health-check', (req, res, next) => {
  db.query('select \'successfully connected\' as "message"')
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});
