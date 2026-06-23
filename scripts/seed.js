require("dotenv").config();

const pool = require("../src/db/pool");

async function seed() {
  try {
    console.log(process.env.DATABASE_URL);

    console.log("Seeding started...");

    await pool.query(`
      INSERT INTO products
      (
        name,
        category,
        price,
        created_at,
        updated_at
      )
      SELECT
        'Product ' || gs,

        (ARRAY[
          'electronics',
          'books',
          'fashion',
          'sports'
        ])[floor(random()*4+1)],

        round((random()*1000)::numeric,2),

        NOW() - (random()*interval '365 days'),
        NOW() - (random()*interval '365 days')

      FROM generate_series(1,200000) gs;
    `);

    console.log("200000 products inserted");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
