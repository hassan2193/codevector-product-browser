const pool = require("../db/pool");

const getProducts = async (req, res) => {
  try {
    const limit = 20;

    const { cursorUpdatedAt, cursorId, category } = req.query;

    let query;
    let values;

    if (cursorUpdatedAt && cursorId) {
      if (category) {
        query = `
      SELECT *
      FROM products
      WHERE category = $1
      AND (updated_at, id) < ($2, $3)
      ORDER BY updated_at DESC, id DESC
      LIMIT $4
    `;

        values = [category, cursorUpdatedAt, Number(cursorId), limit];
      } else {
        query = `
      SELECT *
      FROM products
      WHERE (updated_at, id) < ($1, $2)
      ORDER BY updated_at DESC, id DESC
      LIMIT $3
    `;

        values = [cursorUpdatedAt, Number(cursorId), limit];
      }
    } else {
      if (category) {
        query = `
      SELECT *
      FROM products
      WHERE category = $1
      ORDER BY updated_at DESC, id DESC
      LIMIT $2
    `;

        values = [category, limit];
      } else {
        query = `
      SELECT *
      FROM products
      ORDER BY updated_at DESC, id DESC
      LIMIT $1
    `;

        values = [limit];
      }
    }

    const result = await pool.query(query, values);

    const products = result.rows;

    let nextCursor = null;

    if (products.length > 0) {
      const lastProduct = products[products.length - 1];

      nextCursor = {
        updated_at: lastProduct.updated_at,
        id: lastProduct.id,
      };
    }

    res.json({
      data: products,
      nextCursor,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getProducts,
};
