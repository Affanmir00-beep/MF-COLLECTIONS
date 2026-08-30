export const mockData = {
  collections: [
    { handle: "dastaan", title: "Dastaan", image: "/images/hero.jpg" },
    { handle: "post-cards-of-july", title: "Postcards From July", image: "/images/banner1.jpg" },
    { handle: "virsa", title: "Virsa", image: "/images/banner2.jpg" },
    { handle: "summer-sky", title: "Summer Sky", image: "/images/hero.jpg" },
    { handle: "co-ords", title: "Co-Ords", image: "/images/prod1.jpg" },
    { handle: "silk-elegance", title: "Silk Elegance", image: "/images/prod2.jpg" },
    { handle: "silk-edit", title: "The Silk Edit '26", image: "/images/prod5.jpg" },
    { handle: "rene", title: "Rene", image: "/images/banner1.jpg" },
    { handle: "mini-club", title: "Mini Club", image: "/images/banner2.jpg" },
    { handle: "eastern-23", title: "Eastern", image: "/images/hero.jpg" },
    { handle: "western-wear", title: "Western", image: "/images/prod1.jpg" },
    { handle: "juniors", title: "Juniors", image: "/images/prod2.jpg" },
    { handle: "new-in", title: "New In", image: "/images/prod5.jpg" },
    { handle: "fancy-formals", title: "Formals", image: "/images/hero.jpg" }
  ],
  videoShopping: [
    { id: "v1", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", coverImage: "/images/hero.jpg", views: "4K", productSku: "CF-001", productPrice: 14500 },
    { id: "v2", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", coverImage: "/images/prod1.jpg", views: "1.2K", productSku: "CF-002", productPrice: 16500 },
    { id: "v3", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", coverImage: "/images/prod2.jpg", views: "854", productSku: "CF-003", productPrice: 11000 },
    { id: "v4", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", coverImage: "/images/prod5.jpg", views: "12K", productSku: "CF-004", productPrice: 19500 },
    { id: "v5", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", coverImage: "/images/banner1.jpg", views: "2K", productSku: "CF-005", productPrice: 8500 }
  ],
  announcements: [
    "MF Designs — Be Exclusive, Be Divine, Be Yourself",
    "Additional 10% OFF with Card & Bank Transfer Payment. Coupon: 'PREPAID ORDER'",
    "Nationwide & International Shipping Available | WhatsApp: 03117121215"
  ],
  products: [] // Will be populated
};

const generateProducts = () => {
  const products = [];
  const baseImages = [
    ["/images/hero.jpg", "/images/prod1.jpg"],
    ["/images/banner1.jpg", "/images/banner2.jpg"],
    ["/images/prod2.jpg", "/images/prod5.jpg"]
  ];

  for (let i = 1; i <= 40; i++) {
    products.push({
      id: `cf-${String(i).padStart(3, '0')}`,
      sku: `CF-${String(i).padStart(3, '0')}`,
      title: `Vanya Elegance Look ${i}`,
      collectionHandles: ["dastaan", "new-in", i % 2 === 0 ? "virsa" : "co-ords", i % 3 === 0 ? "silk-edit" : "summer-sky"],
      price: 10000 + (i * 500),
      currency: "PKR",
      images: baseImages[i % 3],
      sizes: ["XS", "S", "M", "L", "XL"],
      availableSizes: i % 5 === 0 ? ["M", "L"] : ["XS", "S", "M", "L", "XL"],
      badge: i === 1 ? "Restocked" : i === 4 ? "Sold out" : null,
      description: "3pc. Fabric: Chiffon/Resham Cotton/Raw Silk. An elegant outfit featuring a beautifully embroidered dupatta and classic plain pants.",
      care: ["Hand wash with a mild detergent. Do not wring.", "Lay flat to air dry.", "Steam or iron on low heat with a pressing cloth.", "Keep in a breathable bag, away from moisture."],
      soldRecently: Math.floor(Math.random() * 30) + 1,
      soldTimeframe: "last 5 hours",
      viewersNow: Math.floor(Math.random() * 100) + 5
    });
  }
  return products;
};

mockData.products = generateProducts();
