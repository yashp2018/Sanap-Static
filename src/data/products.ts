import productTomato from "@/assets/product-tomato.jpg";
import productChili from "@/assets/product-chili.jpg";
import productBrinjal from "@/assets/product-brinjal.jpg";
import productWatermelon from "@/assets/product-watermelon.jpg";
import productCucumber from "@/assets/product-cucumber.jpg";
import productCapsicum from "@/assets/product-capsicum.jpg";

export interface VarietyCharacteristics {
  segment?: string;
  size?: string;
  colour?: string;
  shape?: string;
  plantType?: string;
  avgWeight?: string;
  harvestMethod?: string;
  harvestUniformity?: string;
  relativeMaturity?: string;
  maturityDays?: string;
  sowingSeason?: string;
  harvestingSeason?: string;
  vigour?: string;
  transplantingSeason?: string;
}

export interface Variety {
  id: string;
  name: string;
  company: string;
  cropId: string;
  cropName: string;
  categoryId: string;
  categoryName: string;
  image: string;
  durationDays: number;
  stock: number;
  minOrderQty: number;
  priceExFactory: number;
  price15k: number;
  price30k: number;
  deliveryLocalCharge: number;
  delivery250kmCharge: number;
  description: string;
  features: string[];
  advantages?: string[];
  agronomicTips?: string[];
  characteristics?: VarietyCharacteristics;
  availableMonths?: number[]; // 0-11 for Jan-Dec
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  crops: Crop[];
}

export interface Crop {
  id: string;
  name: string;
  categoryId: string;
  image: string;
  varieties: number;
}

export interface CartItem {
  variety: Variety;
  quantity: number;
  deliveryType: "local" | "250km";
}

export const categories: Category[] = [
  {
    id: "vegetables",
    name: "Vegetable",
    icon: "🥬",
    crops: [
      { id: "tomato", name: "Tomato", categoryId: "vegetables", image: productTomato, varieties: 28 },
      { id: "chili", name: "Chili", categoryId: "vegetables", image: productChili, varieties: 20 },
      { id: "brinjal", name: "Brinjal", categoryId: "vegetables", image: productBrinjal, varieties: 3 },
      { id: "capsicum", name: "Capsicum", categoryId: "vegetables", image: productCapsicum, varieties: 3 },
      { id: "cucumber", name: "Cucumber", categoryId: "vegetables", image: productCucumber, varieties: 3 },
      { id: "cabbage", name: "Cabbage", categoryId: "vegetables", image: productCapsicum, varieties: 18 },
      { id: "cauliflower", name: "Cauliflower", categoryId: "vegetables", image: productCapsicum, varieties: 16 },
      { id: "bittergourd", name: "Bitter Gourd", categoryId: "vegetables", image: productCucumber, varieties: 5 },
      { id: "bottlegourd", name: "Bottle Gourd", categoryId: "vegetables", image: productCucumber, varieties: 3 },
    ],
  },
  {
    id: "fruits",
    name: "Fruit ",
    icon: "🍉",
    crops: [
      { id: "watermelon", name: "Watermelon", categoryId: "fruits", image: productWatermelon, varieties: 9 },
      { id: "muskmelon", name: "Muskmelon", categoryId: "fruits", image: productWatermelon, varieties: 1 },
      { id: "papaya", name: "Papaya", categoryId: "fruits", image: productWatermelon, varieties: 5 },
    ],
  },
  {
    id: "flowers",
    name: "Flower ",
    icon: "🌸",
    crops: [
      { id: "marigold", name: "Marigold", categoryId: "flowers", image: productCapsicum, varieties: 9 },
    ],
  },
  {
    id: "others",
    name: "Other Plants",
    icon: "🌿",
    crops: [
      { id: "sugarcane", name: "Sugar Cane (UUS)", categoryId: "others", image: productCucumber, varieties: 2 },
      { id: "drumstick", name: "Drum Stick", categoryId: "others", image: productCucumber, varieties: 1 },
    ],
  },
];

// Helper to create variety from price list data
function v(
  id: string, name: string, company: string,
  cropId: string, cropName: string, categoryId: string, categoryName: string,
  image: string, durationDays: number,
  priceExFactory: number, price15k: number, price30k: number,
  stock: number,
  description: string, features: string[],
  extras?: {
    advantages?: string[];
    agronomicTips?: string[];
    characteristics?: VarietyCharacteristics;
    availableMonths?: number[];
  }
): Variety {
  return {
    id, name, company, cropId, cropName, categoryId, categoryName, image,
    durationDays, stock, minOrderQty: 1000,
    priceExFactory,
    price15k,
    price30k,
    deliveryLocalCharge: 0.10,
    delivery250kmCharge: 0.20,
    description, features,
    advantages: extras?.advantages,
    agronomicTips: extras?.agronomicTips,
    characteristics: extras?.characteristics,
    availableMonths: extras?.availableMonths,
  };
}

export const sampleVarieties: Variety[] = [
  // ── TOMATO (28 varieties) ──────────────────────────────────────
  {
    id: "tom-aryaman",
    name: "Aryaman",
    company: "Seminis",
    cropId: "tomato", cropName: "Tomato",
    categoryId: "vegetables", categoryName: "Vegetable Plants",
    image: productTomato,
    durationDays: 28,
    stock: 50000, minOrderQty: 1000,
    priceExFactory: 1.50, price15k: 1.50, price30k: 1.40,
    deliveryLocalCharge: 0.10, delivery250kmCharge: 0.20,
    description: "ARYAMAN produces consistently good, high-quality fruit. ARYAMAN fruits are eye-catching and has bright red skin with elongated square shape. Exceptionally firm and smooth fruit with ~12-14 days of shelf life.",
    features: ["Uniform & Attractive Deep Red Fruits", "Excellent Fruit Firmness", "Early Hybrid", "Good Yield Potential"],
    advantages: [
      "Early in harvest & shipment to market, First picking start from 55-60 days from transplanting date.",
      "Suitable for long distance transportation",
    ],
    agronomicTips: [
      "Seed rate: 3.5 ft x 1 ft (60-70 gm/Acre) or 4.0 ft x 1.5 ft (50 gm/Acre)",
      "Transplanting: Seedlings are transplanted when 25-30 days old & 8-10 cm in height with 5-6 leaves.",
    ],
    characteristics: {
      segment: "M", size: "Medium", colour: "Red", shape: "Oval",
      plantType: "Determinate", avgWeight: "90-100 grams",
      harvestMethod: "Loose", harvestUniformity: "Good Uniformity",
      relativeMaturity: "Early-Mid", maturityDays: "60-65",
      sowingSeason: "Spring, Autumn", harvestingSeason: "Spring, Autumn, Winter",
      vigour: "Superior", transplantingSeason: "Spring, Autumn",
    },
    availableMonths: [3, 4, 5, 6, 7, 8, 9, 10], // Apr-Nov
  },
  v("tom-animesh", "Animesh (0108)", "Syngenta", "tomato", "Tomato", "vegetables", "Vegetable Plants", productTomato, 28, 1.50, 1.40, 1.30, 45000,
    "High-quality determinate tomato hybrid from Syngenta with excellent firmness and attractive red color. Suitable for open field cultivation.", ["Disease Resistant", "High Yield", "Firm Fruits", "Good Shelf Life"]),
  v("tom-atharva", "Atharva", "Seminis", "tomato", "Tomato", "vegetables", "Vegetable Plants", productTomato, 28, 1.50, 1.40, 1.30, 40000,
    "Premium Seminis tomato variety with strong plant vigor and uniform fruit shape. Excellent for commercial farming.", ["Uniform Shape", "Strong Vigor", "Commercial Grade", "Good Taste"]),
  v("tom-yogi35", "Yogi-35", "Clause", "tomato", "Tomato", "vegetables", "Vegetable Plants", productTomato, 28, 1.50, 1.40, 1.30, 35000,
    "Clause hybrid tomato with excellent branching and fruit setting. Produces glossy red fruits suitable for both fresh market and processing.", ["Glossy Red Fruits", "Good Branching", "Multi-purpose", "Heat Tolerant"]),
  v("tom-rishika225", "Rishika 225", "Clause", "tomato", "Tomato", "vegetables", "Vegetable Plants", productTomato, 28, 1.50, 1.40, 1.30, 30000,
    "Popular Clause variety known for consistent performance across different growing conditions. Produces medium-large firm fruits.", ["Consistent Performance", "Medium-Large Fruits", "Adaptable", "Firm Texture"]),
  v("tom-t1068", "T-1068", "Namdhari", "tomato", "Tomato", "vegetables", "Vegetable Plants", productTomato, 28, 1.50, 1.40, 1.30, 42000,
    "Namdhari Seeds hybrid with excellent disease tolerance package. Produces round, firm fruits with deep red color.", ["Disease Tolerant", "Round Fruits", "Deep Red", "High Yielding"]),
  v("tom-t2174", "T-2174", "Syngenta", "tomato", "Tomato", "vegetables", "Vegetable Plants", productTomato, 28, 1.50, 1.40, 1.30, 38000,
    "Syngenta premium tomato hybrid suitable for rabi and kharif seasons. Strong plant architecture with concentrated fruit setting.", ["All Season", "Strong Architecture", "Concentrated Setting", "Premium Quality"]),
  v("tom-t2352", "T-2352", "Bioseeds", "tomato", "Tomato", "vegetables", "Vegetable Plants", productTomato, 28, 1.50, 1.40, 1.30, 33000,
    "Bioseeds hybrid tomato with good heat tolerance and virus resistance. Ideal for tropical and subtropical regions.", ["Heat Tolerant", "Virus Resistant", "Tropical Suited", "Good Shelf Life"]),
  v("tom-t2587", "T-2587", "Nuziveedu", "tomato", "Tomato", "vegetables", "Vegetable Plants", productTomato, 28, 1.50, 1.40, 1.30, 36000,
    "Nuziveedu Seeds tomato variety with high yield potential and uniform fruit size. Suitable for both open field and protected cultivation.", ["High Yield", "Uniform Size", "Versatile Cultivation", "Good Firmness"]),
  v("tom-aneesha", "Aneesha", "Chia Tai", "tomato", "Tomato", "vegetables", "Vegetable Plants", productTomato, 28, 1.50, 1.40, 1.30, 28000,
    "Chia Tai hybrid with attractive fruit shape and excellent skin finish. Popular among commercial growers for market appeal.", ["Attractive Shape", "Excellent Skin", "Market Appeal", "Commercial Grade"]),
  v("tom-kirtiman", "Kirtiman", "Seminis", "tomato", "Tomato", "vegetables", "Vegetable Plants", productTomato, 28, 1.60, 1.50, 1.40, 32000,
    "Premium Seminis variety with superior disease package. Produces blocky, firm fruits ideal for long-distance transportation.", ["Superior Disease Package", "Blocky Fruits", "Long Distance Transport", "Premium"]),
  v("tom-virang", "Virang", "Seminis", "tomato", "Tomato", "vegetables", "Vegetable Plants", productTomato, 28, 1.50, 1.40, 1.30, 30000,
    "Seminis hybrid tomato known for vigorous plant growth and heavy fruit load. Excellent performance in varied climatic conditions.", ["Vigorous Growth", "Heavy Fruit Load", "Climate Adaptable", "Consistent Yield"]),
  v("tom-saaho", "Saaho", "Syngenta", "tomato", "Tomato", "vegetables", "Vegetable Plants", productTomato, 28, 1.50, 1.40, 1.30, 35000,
    "Syngenta's Saaho variety is known for excellent fruit quality and plant vigor. Strong root system ensures better nutrient uptake.", ["Strong Root System", "Excellent Quality", "Good Vigor", "Nutrient Efficient"]),
  v("tom-bajirao", "Bajirao", "Syngenta", "tomato", "Tomato", "vegetables", "Vegetable Plants", productTomato, 28, 1.50, 1.40, 1.30, 40000,
    "Popular Syngenta hybrid known for its bold fruit size and deep red attractive color. Excellent market acceptance.", ["Bold Size", "Deep Red Color", "Market Favorite", "High Demand"]),

  // ── CHILI (key varieties) ──────────────────────────────────────
  v("chi-armour", "Armour", "BASF", "chili", "Chili", "vegetables", "Vegetable Plants", productChili, 28, 1.40, 1.30, 1.20, 45000,
    "BASF premium chili hybrid with strong disease resistance package. Produces dark green fruits that turn bright red at maturity.", ["Disease Resistant", "Dark Green Fruits", "High Pungency", "Heavy Bearer"]),
  v("chi-hph5531", "HPH-5531", "Syngenta", "chili", "Chili", "vegetables", "Vegetable Plants", productChili, 28, 1.40, 1.30, 1.20, 40000,
    "Syngenta's popular chili hybrid with excellent branching habit and continuous fruiting. Suitable for both green and dry chili production.", ["Excellent Branching", "Continuous Fruiting", "Dual Purpose", "Pest Tolerant"]),
  v("chi-talwar", "Talwar", "Kalash", "chili", "Chili", "vegetables", "Vegetable Plants", productChili, 28, 1.40, 1.30, 1.20, 38000,
    "Kalash Seeds chili variety with sword-shaped fruits and uniform size. Known for high pungency and excellent drying ratio.", ["Sword Shape", "Uniform Size", "High Pungency", "Good Drying Ratio"]),
  v("chi-shark1", "Shark-1", "Star Field", "chili", "Chili", "vegetables", "Vegetable Plants", productChili, 28, 1.40, 1.30, 1.20, 35000,
    "Star Field hybrid known for aggressive plant growth and heavy yield. Large-sized fruits with good skin texture.", ["Aggressive Growth", "Heavy Yield", "Large Fruits", "Good Texture"]),
  v("chi-sitaragold", "Sitara Gold", "Seminis", "chili", "Chili", "vegetables", "Vegetable Plants", productChili, 28, 1.40, 1.30, 1.20, 30000,
    "Seminis premium chili with golden-tipped dark green fruits. Excellent for fresh market with attractive appearance.", ["Golden Tips", "Dark Green", "Fresh Market", "Attractive"]),
  v("chi-us917", "US-917", "BASF", "chili", "Chili", "vegetables", "Vegetable Plants", productChili, 28, 1.40, 1.30, 1.20, 42000,
    "BASF hybrid with excellent virus tolerance and heavy bearing capacity. Produces uniform wrinkle-free fruits.", ["Virus Tolerant", "Heavy Bearer", "Wrinkle Free", "Uniform Fruits"]),

  // ── BITTER GOURD ──────────────────────────────────────────────
  v("bg-b6214", "B 6214", "BASF", "bittergourd", "Bitter Gourd", "vegetables", "Vegetable Plants", productCucumber, 12, 4.50, 4.20, 4.00, 20000,
    "BASF premium bitter gourd hybrid with dark green glossy fruits. Excellent for commercial cultivation with high yield potential.", ["Dark Green Glossy", "High Yield", "Commercial Grade", "Uniform Fruits"]),
  v("bg-rushaan", "Rushaan", "BASF", "bittergourd", "Bitter Gourd", "vegetables", "Vegetable Plants", productCucumber, 12, 4.50, 4.20, 4.00, 18000,
    "BASF hybrid with excellent fruit quality and extended harvesting period. Strong vine growth ensures sustained production.", ["Extended Harvest", "Strong Vine", "Excellent Quality", "Sustained Production"]),

  // ── BRINJAL ────────────────────────────────────────────────────
  v("brn-comandar", "Comandar", "Ajeet Seeds", "brinjal", "Brinjal", "vegetables", "Vegetable Plants", productBrinjal, 28, 1.20, 1.10, 1.00, 25000,
    "Ajeet Seeds brinjal hybrid with glossy purple-black fruits. Strong plant architecture with excellent wilt tolerance.", ["Glossy Purple-Black", "Wilt Tolerant", "Strong Architecture", "Good Taste"]),
  v("brn-bartok", "Bartok", "Enza Zaden", "brinjal", "Brinjal", "vegetables", "Vegetable Plants", productBrinjal, 28, 6.00, 5.50, 5.00, 15000,
    "Premium Enza Zaden grafted brinjal with superior disease resistance. High-quality oval fruits for premium market segment.", ["Grafted", "Superior Resistance", "Premium Quality", "Oval Fruits"]),

  // ── CABBAGE ────────────────────────────────────────────────────
  v("cab-admiral", "Admiral", "Clause", "cabbage", "Cabbage", "vegetables", "Vegetable Plants", productCapsicum, 28, 0.80, 0.70, 0.60, 50000,
    "Clause hybrid cabbage with tight, compact heads and excellent uniformity. Good for fresh market and processing.", ["Compact Heads", "Excellent Uniformity", "Dual Purpose", "Good Shelf Life"]),
  v("cab-saint", "Saint", "Seminis", "cabbage", "Cabbage", "vegetables", "Vegetable Plants", productCapsicum, 28, 0.90, 0.80, 0.70, 45000,
    "Seminis premium cabbage variety with blue-green outer leaves and white interior. Produces heavy, round heads.", ["Blue-Green Leaves", "Heavy Heads", "Round Shape", "Premium"]),

  // ── CAPSICUM ───────────────────────────────────────────────────
  v("cap-asha", "Asha", "Clause", "capsicum", "Capsicum", "vegetables", "Vegetable Plants", productCapsicum, 33, 2.50, 2.30, 2.10, 20000,
    "Clause capsicum hybrid with blocky, thick-walled fruits. Excellent for polyhouse cultivation with high yield potential.", ["Blocky Fruits", "Thick Walled", "Polyhouse Ready", "High Yield"]),
  v("cap-paladin", "Paladin", "Syngenta", "capsicum", "Capsicum", "vegetables", "Vegetable Plants", productCapsicum, 33, 2.50, 2.30, 2.10, 18000,
    "Syngenta's premium capsicum with excellent fruit size and color development. Strong plant with good disease tolerance.", ["Excellent Size", "Good Color", "Disease Tolerant", "Strong Plant"]),

  // ── CAULIFLOWER ────────────────────────────────────────────────
  v("cfl-c1522", "C-1522", "Syngenta", "cauliflower", "Cauliflower", "vegetables", "Vegetable Plants", productCapsicum, 28, 0.90, 0.80, 0.70, 40000,
    "Syngenta cauliflower hybrid with snow-white compact curds. Excellent self-wrapping leaves protect curd quality.", ["Snow White Curds", "Self Wrapping", "Compact", "Premium Quality"]),

  // ── CUCUMBER ───────────────────────────────────────────────────
  v("cuc-gipsy", "Gipsy", "Pyramid", "cucumber", "Cucumber", "vegetables", "Vegetable Plants", productCucumber, 12, 2.50, 2.30, 2.10, 25000,
    "Pyramid Seeds hybrid cucumber with dark green uniform fruits. Excellent for both open field and protected cultivation.", ["Dark Green", "Uniform Fruits", "Versatile Cultivation", "High Yielding"]),

  // ── WATERMELON ─────────────────────────────────────────────────
  v("wm-bahubali", "Bahubali", "Seminis", "watermelon", "Watermelon", "fruits", "Fruit Plants", productWatermelon, 28, 2.80, 2.60, 2.40, 30000,
    "Seminis hybrid watermelon with large, oblong fruits weighing 8-12 kg. Bright red flesh with excellent sweetness.", ["Large Oblong Fruits", "Bright Red Flesh", "High Sweetness", "8-12 kg Weight"]),
  v("wm-sugarqueen", "Sugar Queen", "Syngenta", "watermelon", "Watermelon", "fruits", "Fruit Plants", productWatermelon, 28, 2.80, 2.60, 2.40, 35000,
    "Syngenta's popular seedless watermelon with high sugar content. Produces uniform round fruits with excellent rind strength.", ["Seedless", "High Sugar", "Uniform Round", "Strong Rind"]),
  v("wm-max", "Max", "BASF", "watermelon", "Watermelon", "fruits", "Fruit Plants", productWatermelon, 28, 2.80, 2.60, 2.40, 28000,
    "BASF hybrid watermelon with excellent field performance and heavy fruit weight. Deep red flesh with crispy texture.", ["Heavy Fruit", "Deep Red Flesh", "Crispy Texture", "Field Proven"]),

  // ── MARIGOLD ───────────────────────────────────────────────────
  v("mar-edenorange", "Eden Orange", "Pyramid", "marigold", "Marigold", "flowers", "Flower Plants", productCapsicum, 28, 3.00, 2.80, 2.60, 40000,
    "Pyramid Seeds marigold with vibrant orange blooms. Excellent for commercial flower production and garland making.", ["Vibrant Orange", "Commercial Grade", "Long Lasting", "Garland Quality"]),
  v("mar-freshorange", "Fresh Orange", "Namdhari", "marigold", "Marigold", "flowers", "Flower Plants", productCapsicum, 28, 3.00, 2.80, 2.60, 35000,
    "Namdhari marigold hybrid with dense, fully double flowers. Brilliant orange color with excellent shelf life after cutting.", ["Dense Double Flowers", "Brilliant Orange", "Long Shelf Life", "Premium"]),

  // ── PAPAYA ─────────────────────────────────────────────────────
  v("pap-taiwan786", "Taiwan 786", "Known You Seeds", "papaya", "Papaya", "fruits", "Fruit Plants", productWatermelon, 45, 16.00, 15.00, 14.00, 10000,
    "Known You Seeds premium papaya variety from Taiwan. Produces sweet, large fruits with bright orange flesh. Excellent for commercial farming.", ["Taiwan Origin", "Sweet Flesh", "Large Fruits", "Commercial Grade"]),
];

export function calculatePrice(variety: Variety, quantity: number): number {
  if (quantity >= 30000) return variety.price30k;
  if (quantity >= 15000) return variety.price15k;
  return variety.priceExFactory;
}

export function calculateDeliveryCharge(variety: Variety, quantity: number, deliveryType: "local" | "250km"): number {
  const charge = deliveryType === "local" ? variety.deliveryLocalCharge : variety.delivery250kmCharge;
  return charge * quantity;
}

export function calculateTotal(item: CartItem): number {
  const price = calculatePrice(item.variety, item.quantity);
  const delivery = calculateDeliveryCharge(item.variety, item.quantity, item.deliveryType);
  return price * item.quantity + delivery;
}
