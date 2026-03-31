require("dotenv").config();
const pool = require("../db");

// ── Categories ────────────────────────────────────────────────
const categories = [
  { slug: "vegetables", name: "Vegetable",    icon: "🥬", sort_order: 1 },
  { slug: "fruits",     name: "Fruit",        icon: "🍉", sort_order: 2 },
  { slug: "flowers",    name: "Flower",       icon: "🌸", sort_order: 3 },
  { slug: "others",     name: "Other Plants", icon: "🌿", sort_order: 4 },
];

// ── Crops ─────────────────────────────────────────────────────
const crops = [
  // Vegetables
  { slug: "tomato",      name: "Tomato",       category: "vegetables", sort_order: 1 },
  { slug: "chili",       name: "Chili",        category: "vegetables", sort_order: 2 },
  { slug: "brinjal",     name: "Brinjal",      category: "vegetables", sort_order: 3 },
  { slug: "capsicum",    name: "Capsicum",     category: "vegetables", sort_order: 4 },
  { slug: "cucumber",    name: "Cucumber",     category: "vegetables", sort_order: 5 },
  { slug: "cabbage",     name: "Cabbage",      category: "vegetables", sort_order: 6 },
  { slug: "cauliflower", name: "Cauliflower",  category: "vegetables", sort_order: 7 },
  { slug: "bittergourd", name: "Bitter Gourd", category: "vegetables", sort_order: 8 },
  { slug: "bottlegourd", name: "Bottle Gourd", category: "vegetables", sort_order: 9 },
  // Fruits
  { slug: "watermelon",  name: "Watermelon",   category: "fruits",     sort_order: 1 },
  { slug: "muskmelon",   name: "Muskmelon",    category: "fruits",     sort_order: 2 },
  { slug: "papaya",      name: "Papaya",       category: "fruits",     sort_order: 3 },
  // Flowers
  { slug: "marigold",    name: "Marigold",     category: "flowers",    sort_order: 1 },
  // Others
  { slug: "sugarcane",   name: "Sugar Cane (UUS)", category: "others", sort_order: 1 },
  { slug: "drumstick",   name: "Drum Stick",   category: "others",     sort_order: 2 },
];

// ── Varieties ─────────────────────────────────────────────────
// v(slug, name, company, crop, duration, priceEx, price15k, price30k, delivLocal, deliv250, stock, desc, features, extras)
const varieties = [
  // ── TOMATO ──────────────────────────────────────────────────
  {
    slug: "tom-aryaman", name: "Aryaman", company: "Seminis", crop: "tomato",
    duration_days: 28, price_ex_factory: 1.50, price_15k: 1.50, price_30k: 1.40,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 50000,
    description: "ARYAMAN produces consistently good, high-quality fruit. Exceptionally firm and smooth fruit with ~12-14 days of shelf life.",
    features: ["Uniform & Attractive Deep Red Fruits","Excellent Fruit Firmness","Early Hybrid","Good Yield Potential"],
    advantages: ["Early in harvest & shipment to market, First picking start from 55-60 days from transplanting date.","Suitable for long distance transportation"],
    agronomic_tips: ["Seed rate: 3.5 ft x 1 ft (60-70 gm/Acre)","Transplanting: Seedlings are transplanted when 25-30 days old & 8-10 cm in height with 5-6 leaves."],
    char_segment: "M", char_size: "Medium", char_colour: "Red", char_shape: "Oval",
    char_plant_type: "Determinate", char_avg_weight: "90-100 grams",
    char_maturity_days: "60-65", char_sowing_season: "Spring, Autumn",
    char_harvesting_season: "Spring, Autumn, Winter", char_vigour: "Superior",
    available_months: [3,4,5,6,7,8,9,10],
  },
  {
    slug: "tom-animesh", name: "Animesh (0108)", company: "Syngenta", crop: "tomato",
    duration_days: 28, price_ex_factory: 1.50, price_15k: 1.50, price_30k: 1.40,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 45000,
    description: "High-quality determinate tomato hybrid from Syngenta with excellent firmness and attractive red color.",
    features: ["Disease Resistant","High Yield","Firm Fruits","Good Shelf Life"],
  },
  {
    slug: "tom-atharva", name: "Atharva", company: "Seminis", crop: "tomato",
    duration_days: 28, price_ex_factory: 1.50, price_15k: 1.50, price_30k: 1.40,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 40000,
    description: "Premium Seminis tomato variety with strong plant vigor and uniform fruit shape.",
    features: ["Uniform Shape","Strong Vigor","Commercial Grade","Good Taste"],
  },
  {
    slug: "tom-yogi35", name: "Yogi-35", company: "Clause", crop: "tomato",
    duration_days: 28, price_ex_factory: 1.50, price_15k: 1.50, price_30k: 1.40,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 35000,
    description: "Clause hybrid tomato with excellent branching and fruit setting. Produces glossy red fruits.",
    features: ["Glossy Red Fruits","Good Branching","Multi-purpose","Heat Tolerant"],
  },
  {
    slug: "tom-rishika225", name: "Rishika 225", company: "Clause", crop: "tomato",
    duration_days: 28, price_ex_factory: 1.50, price_15k: 1.50, price_30k: 1.40,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 30000,
    description: "Popular Clause variety known for consistent performance across different growing conditions.",
    features: ["Consistent Performance","Medium-Large Fruits","Adaptable","Firm Texture"],
  },
  {
    slug: "tom-t1068", name: "T-1068", company: "Namdhari", crop: "tomato",
    duration_days: 28, price_ex_factory: 1.50, price_15k: 1.50, price_30k: 1.40,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 42000,
    description: "Namdhari Seeds hybrid with excellent disease tolerance package. Produces round, firm fruits with deep red color.",
    features: ["Disease Tolerant","Round Fruits","Deep Red","High Yielding"],
  },
  {
    slug: "tom-t2174", name: "T-2174", company: "Syngenta", crop: "tomato",
    duration_days: 28, price_ex_factory: 1.50, price_15k: 1.50, price_30k: 1.40,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 38000,
    description: "Syngenta premium tomato hybrid suitable for rabi and kharif seasons.",
    features: ["All Season","Strong Architecture","Concentrated Setting","Premium Quality"],
  },
  {
    slug: "tom-t2352", name: "T-2352", company: "Bioseeds", crop: "tomato",
    duration_days: 28, price_ex_factory: 1.50, price_15k: 1.50, price_30k: 1.40,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 33000,
    description: "Bioseeds hybrid tomato with good heat tolerance and virus resistance.",
    features: ["Heat Tolerant","Virus Resistant","Tropical Suited","Good Shelf Life"],
  },
  {
    slug: "tom-t2587", name: "T-2587", company: "Nuziveedu", crop: "tomato",
    duration_days: 28, price_ex_factory: 1.50, price_15k: 1.50, price_30k: 1.40,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 36000,
    description: "Nuziveedu Seeds tomato variety with high yield potential and uniform fruit size.",
    features: ["High Yield","Uniform Size","Versatile Cultivation","Good Firmness"],
  },
  {
    slug: "tom-aneesha", name: "Aneesha", company: "Chia Tai", crop: "tomato",
    duration_days: 28, price_ex_factory: 1.50, price_15k: 1.50, price_30k: 1.40,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 28000,
    description: "Chia Tai hybrid with attractive fruit shape and excellent skin finish.",
    features: ["Attractive Shape","Excellent Skin","Market Appeal","Commercial Grade"],
  },
  {
    slug: "tom-kirtiman", name: "Kirtiman", company: "Seminis", crop: "tomato",
    duration_days: 28, price_ex_factory: 1.60, price_15k: 1.60, price_30k: 1.50,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 32000,
    description: "Premium Seminis variety with superior disease package. Produces blocky, firm fruits.",
    features: ["Superior Disease Package","Blocky Fruits","Long Distance Transport","Premium"],
  },
  {
    slug: "tom-virang", name: "Virang", company: "Seminis", crop: "tomato",
    duration_days: 28, price_ex_factory: 1.50, price_15k: 1.50, price_30k: 1.40,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 30000,
    description: "Seminis hybrid tomato known for vigorous plant growth and heavy fruit load.",
    features: ["Vigorous Growth","Heavy Fruit Load","Climate Adaptable","Consistent Yield"],
  },
  {
    slug: "tom-saaho", name: "Saaho", company: "Syngenta", crop: "tomato",
    duration_days: 28, price_ex_factory: 1.50, price_15k: 1.50, price_30k: 1.40,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 35000,
    description: "Syngenta's Saaho variety is known for excellent fruit quality and plant vigor.",
    features: ["Strong Root System","Excellent Quality","Good Vigor","Nutrient Efficient"],
  },
  {
    slug: "tom-bajirao", name: "Bajirao", company: "Syngenta", crop: "tomato",
    duration_days: 28, price_ex_factory: 1.50, price_15k: 1.50, price_30k: 1.40,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 40000,
    description: "Popular Syngenta hybrid known for its bold fruit size and deep red attractive color.",
    features: ["Bold Size","Deep Red Color","Market Favorite","High Demand"],
  },
  // ── CHILI ────────────────────────────────────────────────────
  {
    slug: "chi-armour", name: "Armour", company: "BASF", crop: "chili",
    duration_days: 28, price_ex_factory: 1.40, price_15k: 1.40, price_30k: 1.30,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 45000,
    description: "BASF premium chili hybrid with strong disease resistance package.",
    features: ["Disease Resistant","Dark Green Fruits","High Pungency","Heavy Bearer"],
  },
  {
    slug: "chi-hph5531", name: "HPH-5531", company: "Syngenta", crop: "chili",
    duration_days: 28, price_ex_factory: 1.40, price_15k: 1.40, price_30k: 1.30,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 40000,
    description: "Syngenta's popular chili hybrid with excellent branching habit and continuous fruiting.",
    features: ["Excellent Branching","Continuous Fruiting","Dual Purpose","Pest Tolerant"],
  },
  {
    slug: "chi-talwar", name: "Talwar", company: "Kalash", crop: "chili",
    duration_days: 28, price_ex_factory: 1.40, price_15k: 1.40, price_30k: 1.30,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 38000,
    description: "Kalash Seeds chili variety with sword-shaped fruits and uniform size.",
    features: ["Sword Shape","Uniform Size","High Pungency","Good Drying Ratio"],
  },
  {
    slug: "chi-shark1", name: "Shark-1", company: "Star Field", crop: "chili",
    duration_days: 28, price_ex_factory: 1.40, price_15k: 1.40, price_30k: 1.30,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 35000,
    description: "Star Field hybrid known for aggressive plant growth and heavy yield.",
    features: ["Aggressive Growth","Heavy Yield","Large Fruits","Good Texture"],
  },
  {
    slug: "chi-sitaragold", name: "Sitara Gold", company: "Seminis", crop: "chili",
    duration_days: 28, price_ex_factory: 1.40, price_15k: 1.40, price_30k: 1.30,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 30000,
    description: "Seminis premium chili with golden-tipped dark green fruits.",
    features: ["Golden Tips","Dark Green","Fresh Market","Attractive"],
  },
  {
    slug: "chi-us917", name: "US-917", company: "BASF", crop: "chili",
    duration_days: 28, price_ex_factory: 1.40, price_15k: 1.40, price_30k: 1.30,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 42000,
    description: "BASF hybrid with excellent virus tolerance and heavy bearing capacity.",
    features: ["Virus Tolerant","Heavy Bearer","Wrinkle Free","Uniform Fruits"],
  },
  // ── BITTER GOURD ─────────────────────────────────────────────
  {
    slug: "bg-b6214", name: "B 6214", company: "BASF", crop: "bittergourd",
    duration_days: 12, price_ex_factory: 4.50, price_15k: 4.50, price_30k: 4.40,
    delivery_local_charge: 0.20, delivery_250km_charge: 0.30, stock: 20000,
    description: "BASF premium bitter gourd hybrid with dark green glossy fruits.",
    features: ["Dark Green Glossy","High Yield","Commercial Grade","Uniform Fruits"],
  },
  {
    slug: "bg-rushaan", name: "Rushaan", company: "BASF", crop: "bittergourd",
    duration_days: 12, price_ex_factory: 4.50, price_15k: 4.50, price_30k: 4.40,
    delivery_local_charge: 0.20, delivery_250km_charge: 0.30, stock: 18000,
    description: "BASF hybrid with excellent fruit quality and extended harvesting period.",
    features: ["Extended Harvest","Strong Vine","Excellent Quality","Sustained Production"],
  },
  // ── BRINJAL ──────────────────────────────────────────────────
  {
    slug: "brn-comandar", name: "Comandar", company: "Ajeet Seeds", crop: "brinjal",
    duration_days: 28, price_ex_factory: 1.20, price_15k: 1.20, price_30k: 1.10,
    delivery_local_charge: 0.20, delivery_250km_charge: 0.30, stock: 25000,
    description: "Ajeet Seeds brinjal hybrid with glossy purple-black fruits.",
    features: ["Glossy Purple-Black","Wilt Tolerant","Strong Architecture","Good Taste"],
  },
  {
    slug: "brn-bartok", name: "Bartok", company: "Enza Zaden", crop: "brinjal",
    duration_days: 28, price_ex_factory: 6.00, price_15k: 6.00, price_30k: 5.90,
    delivery_local_charge: 0.20, delivery_250km_charge: 0.30, stock: 15000,
    description: "Premium Enza Zaden grafted brinjal with superior disease resistance.",
    features: ["Grafted","Superior Resistance","Premium Quality","Oval Fruits"],
  },
  // ── CABBAGE ──────────────────────────────────────────────────
  {
    slug: "cab-admiral", name: "Admiral", company: "Clause", crop: "cabbage",
    duration_days: 28, price_ex_factory: 0.80, price_15k: 0.80, price_30k: 0.70,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 50000,
    description: "Clause hybrid cabbage with tight, compact heads and excellent uniformity.",
    features: ["Compact Heads","Excellent Uniformity","Dual Purpose","Good Shelf Life"],
  },
  {
    slug: "cab-saint", name: "Saint", company: "Seminis", crop: "cabbage",
    duration_days: 28, price_ex_factory: 0.90, price_15k: 0.90, price_30k: 0.80,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 45000,
    description: "Seminis premium cabbage variety with blue-green outer leaves and white interior.",
    features: ["Blue-Green Leaves","Heavy Heads","Round Shape","Premium"],
  },
  // ── CAPSICUM ─────────────────────────────────────────────────
  {
    slug: "cap-asha", name: "Asha", company: "Clause", crop: "capsicum",
    duration_days: 33, price_ex_factory: 2.50, price_15k: 2.50, price_30k: 2.40,
    delivery_local_charge: 0.20, delivery_250km_charge: 0.30, stock: 20000,
    description: "Clause capsicum hybrid with blocky, thick-walled fruits.",
    features: ["Blocky Fruits","Thick Walled","Polyhouse Ready","High Yield"],
  },
  {
    slug: "cap-paladin", name: "Paladin", company: "Syngenta", crop: "capsicum",
    duration_days: 33, price_ex_factory: 2.50, price_15k: 2.50, price_30k: 2.40,
    delivery_local_charge: 0.20, delivery_250km_charge: 0.30, stock: 18000,
    description: "Syngenta's premium capsicum with excellent fruit size and color development.",
    features: ["Excellent Size","Good Color","Disease Tolerant","Strong Plant"],
  },
  // ── CAULIFLOWER ──────────────────────────────────────────────
  {
    slug: "cfl-c1522", name: "C-1522", company: "Syngenta", crop: "cauliflower",
    duration_days: 28, price_ex_factory: 0.90, price_15k: 0.90, price_30k: 0.80,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 40000,
    description: "Syngenta cauliflower hybrid with snow-white compact curds.",
    features: ["Snow White Curds","Self Wrapping","Compact","Premium Quality"],
  },
  // ── CUCUMBER ─────────────────────────────────────────────────
  {
    slug: "cuc-gipsy", name: "Gipsy", company: "Pyramid", crop: "cucumber",
    duration_days: 12, price_ex_factory: 2.50, price_15k: 2.50, price_30k: 2.40,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 25000,
    description: "Pyramid Seeds hybrid cucumber with dark green uniform fruits.",
    features: ["Dark Green","Uniform Fruits","Versatile Cultivation","High Yielding"],
  },
  // ── WATERMELON ───────────────────────────────────────────────
  {
    slug: "wm-bahubali", name: "Bahubali", company: "Seminis", crop: "watermelon",
    duration_days: 28, price_ex_factory: 2.80, price_15k: 2.80, price_30k: 2.70,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 30000,
    description: "Seminis hybrid watermelon with large, oblong fruits weighing 8-12 kg.",
    features: ["Large Oblong Fruits","Bright Red Flesh","High Sweetness","8-12 kg Weight"],
  },
  {
    slug: "wm-sugarqueen", name: "Sugar Queen", company: "Syngenta", crop: "watermelon",
    duration_days: 28, price_ex_factory: 2.80, price_15k: 2.80, price_30k: 2.70,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 35000,
    description: "Syngenta's popular seedless watermelon with high sugar content.",
    features: ["Seedless","High Sugar","Uniform Round","Strong Rind"],
  },
  {
    slug: "wm-max", name: "Max", company: "BASF", crop: "watermelon",
    duration_days: 28, price_ex_factory: 2.80, price_15k: 2.80, price_30k: 2.70,
    delivery_local_charge: 0.10, delivery_250km_charge: 0.20, stock: 28000,
    description: "BASF hybrid watermelon with excellent field performance and heavy fruit weight.",
    features: ["Heavy Fruit","Deep Red Flesh","Crispy Texture","Field Proven"],
  },
  // ── MARIGOLD ─────────────────────────────────────────────────
  {
    slug: "mar-edenorange", name: "Eden Orange", company: "Pyramid", crop: "marigold",
    duration_days: 28, price_ex_factory: 3.00, price_15k: 3.00, price_30k: 2.90,
    delivery_local_charge: 0.20, delivery_250km_charge: 0.30, stock: 40000,
    description: "Pyramid Seeds marigold with vibrant orange blooms.",
    features: ["Vibrant Orange","Commercial Grade","Long Lasting","Garland Quality"],
  },
  {
    slug: "mar-freshorange", name: "Fresh Orange", company: "Namdhari", crop: "marigold",
    duration_days: 28, price_ex_factory: 3.00, price_15k: 3.00, price_30k: 2.90,
    delivery_local_charge: 0.20, delivery_250km_charge: 0.30, stock: 35000,
    description: "Namdhari marigold hybrid with dense, fully double flowers.",
    features: ["Dense Double Flowers","Brilliant Orange","Long Shelf Life","Premium"],
  },
  // ── PAPAYA ───────────────────────────────────────────────────
  {
    slug: "pap-taiwan786", name: "Taiwan 786", company: "Known You Seeds", crop: "papaya",
    duration_days: 45, price_ex_factory: 16.00, price_15k: 16.00, price_30k: 15.90,
    delivery_local_charge: 0.50, delivery_250km_charge: 0.80, stock: 10000,
    description: "Known You Seeds premium papaya variety from Taiwan. Produces sweet, large fruits.",
    features: ["Taiwan Origin","Sweet Flesh","Large Fruits","Commercial Grade"],
  },
];

// ── Seed function ─────────────────────────────────────────────
async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("⏳ Seeding categories...");
    const catMap = {};
    for (const cat of categories) {
      const { rows } = await client.query(
        `INSERT INTO categories (slug, name, icon, sort_order)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, icon=EXCLUDED.icon
         RETURNING id, slug`,
        [cat.slug, cat.name, cat.icon, cat.sort_order]
      );
      catMap[rows[0].slug] = rows[0].id;
    }
    console.log(`   ✓ ${categories.length} categories`);

    console.log("⏳ Seeding crops...");
    const cropMap = {};
    for (const crop of crops) {
      const { rows } = await client.query(
        `INSERT INTO crops (slug, name, category_id, sort_order)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name
         RETURNING id, slug`,
        [crop.slug, crop.name, catMap[crop.category], crop.sort_order]
      );
      cropMap[rows[0].slug] = rows[0].id;
    }
    console.log(`   ✓ ${crops.length} crops`);

    console.log("⏳ Seeding varieties...");
    for (const v of varieties) {
      await client.query(
        `INSERT INTO varieties (
           slug, name, company, crop_id,
           duration_days, stock, min_order_qty,
           price_ex_factory, price_15k, price_30k,
           delivery_local_charge, delivery_250km_charge,
           description, features, advantages, agronomic_tips,
           char_segment, char_size, char_colour, char_shape,
           char_plant_type, char_avg_weight, char_maturity_days,
           char_sowing_season, char_harvesting_season, char_vigour,
           available_months
         ) VALUES (
           $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,
           $17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27
         )
         ON CONFLICT (slug) DO UPDATE SET
           stock=EXCLUDED.stock,
           price_ex_factory=EXCLUDED.price_ex_factory,
           price_15k=EXCLUDED.price_15k,
           price_30k=EXCLUDED.price_30k`,
        [
          v.slug, v.name, v.company, cropMap[v.crop],
          v.duration_days, v.stock, 1000,
          v.price_ex_factory, v.price_15k, v.price_30k,
          v.delivery_local_charge, v.delivery_250km_charge,
          v.description,
          v.features        || [],
          v.advantages      || [],
          v.agronomic_tips  || [],
          v.char_segment    || null, v.char_size         || null,
          v.char_colour     || null, v.char_shape        || null,
          v.char_plant_type || null, v.char_avg_weight   || null,
          v.char_maturity_days      || null,
          v.char_sowing_season      || null,
          v.char_harvesting_season  || null,
          v.char_vigour             || null,
          v.available_months        || [],
        ]
      );
    }
    console.log(`   ✓ ${varieties.length} varieties`);

    await client.query("COMMIT");
    console.log("\n✅ Seed complete!");

    // Summary
    const counts = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM categories) AS categories,
        (SELECT COUNT(*) FROM crops)      AS crops,
        (SELECT COUNT(*) FROM varieties)  AS varieties
    `);
    const c = counts.rows[0];
    console.log(`   categories: ${c.categories} | crops: ${c.crops} | varieties: ${c.varieties}`);

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
