import { PrismaClient, UserRole, ArticleStatus, RiskLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.productBadge.deleteMany();
  await prisma.productIngredientFlag.deleteMany();
  await prisma.affiliateLink.deleteMany();
  await prisma.product.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.ingredientFlag.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.article.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@healthpedhyan.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      name: process.env.ADMIN_NAME || 'Admin User',
      passwordHash: hashedPassword,
      role: UserRole.ADMIN,
    },
  });
  console.log('✅ Created admin user:', adminUser.email);

  // Create Brands
  const brands = await Promise.all([
    prisma.brand.create({ data: { name: 'True Elements', slug: 'true-elements' } }),
    prisma.brand.create({ data: { name: 'Yoga Bar', slug: 'yoga-bar' } }),
    prisma.brand.create({ data: { name: 'Slurrp Farm', slug: 'slurrp-farm' } }),
    prisma.brand.create({ data: { name: 'Pintola', slug: 'pintola' } }),
    prisma.brand.create({ data: { name: 'Nourish Organics', slug: 'nourish-organics' } }),
  ]);
  console.log('✅ Created brands');

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Snacks', slug: 'snacks' } }),
    prisma.category.create({ data: { name: 'Breakfast Cereals', slug: 'breakfast-cereals' } }),
    prisma.category.create({ data: { name: 'Nut Butters', slug: 'nut-butters' } }),
    prisma.category.create({ data: { name: 'Cooking Oils', slug: 'cooking-oils' } }),
    prisma.category.create({ data: { name: 'Kids Foods', slug: 'kids-foods' } }),
  ]);
  console.log('✅ Created categories');

  // Create Badges
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        name: 'Palm Oil Free',
        code: 'PALM_OIL_FREE',
        description: 'Contains no palm oil or palm oil derivatives',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Low Sugar',
        code: 'LOW_SUGAR',
        description: 'Contains less than 5g sugar per 100g serving',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Whole Grain',
        code: 'WHOLE_GRAIN',
        description: 'Made primarily from whole grain ingredients',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'No Artificial Colors',
        code: 'NO_ARTIFICIAL_COLORS',
        description: 'Free from artificial food coloring',
      },
    }),
  ]);
  console.log('✅ Created badges');

  // Create Ingredient Flags
  const flags = await Promise.all([
    prisma.ingredientFlag.create({
      data: {
        name: 'Palm Oil',
        code: 'PALM_OIL',
        description: 'Contains palm oil - linked to environmental concerns',
      },
    }),
    prisma.ingredientFlag.create({
      data: {
        name: 'High Fructose Corn Syrup',
        code: 'HFCS',
        description: 'Contains HFCS - linked to metabolic issues',
      },
    }),
    prisma.ingredientFlag.create({
      data: {
        name: 'Artificial Colors',
        code: 'ARTIFICIAL_COLORS',
        description: 'Contains synthetic food coloring',
      },
    }),
    prisma.ingredientFlag.create({
      data: {
        name: 'Trans Fats',
        code: 'TRANS_FATS',
        description: 'Contains partially hydrogenated oils',
      },
    }),
  ]);
  console.log('✅ Created ingredient flags');

  // Create Products
  const product1 = await prisma.product.create({
    data: {
      title: 'True Elements Roasted Mixed Nuts',
      slug: 'true-elements-roasted-mixed-nuts',
      brandId: brands[0].id,
      categoryId: categories[0].id,
      shortSummary:
        'A nutritious blend of almonds, cashews, and walnuts with no added palm oil or artificial preservatives.',
      description:
        'These lightly roasted mixed nuts are perfect for snacking. Rich in protein, healthy fats, and essential nutrients. No palm oil, no artificial colors, and minimal processing.',
      heroImage: '/images/products/roasted-mixed-nuts.jpg',
      nutritionJson: {
        per100g: {
          energy: '550 kcal',
          protein: '18g',
          carbs: '22g',
          sugar: '3g',
          fat: '45g',
          fiber: '8g',
        },
      },
      ingredientsText: 'Almonds, Cashews, Walnuts, Sea Salt',
      allergensText: 'Tree nuts',
      healthScore: 85,
      isPalmOilFree: true,
      isArtificialColorFree: true,
      isLowSugar: true,
      isMeetsStandard: true,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      title: 'Yoga Bar Protein Muesli',
      slug: 'yoga-bar-protein-muesli',
      brandId: brands[1].id,
      categoryId: categories[1].id,
      shortSummary:
        'High-protein breakfast cereal made with whole grains and no refined sugar.',
      description:
        'Start your day right with this protein-packed muesli. Made from whole oats, nuts, and seeds with natural sweeteners only. Free from palm oil and artificial additives.',
      heroImage: '/images/products/protein-muesli.jpg',
      nutritionJson: {
        per100g: {
          energy: '380 kcal',
          protein: '12g',
          carbs: '58g',
          sugar: '8g',
          fat: '11g',
          fiber: '10g',
        },
      },
      ingredientsText: 'Whole Oats, Almonds, Sunflower Seeds, Pumpkin Seeds, Dates, Honey',
      allergensText: 'Tree nuts, Gluten',
      healthScore: 90,
      isPalmOilFree: true,
      isArtificialColorFree: true,
      isWholeGrain: true,
      isMeetsStandard: true,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      title: 'Pintola All Natural Peanut Butter',
      slug: 'pintola-peanut-butter',
      brandId: brands[3].id,
      categoryId: categories[2].id,
      shortSummary: 'Pure peanut butter with no added sugar, salt, or hydrogenated oils.',
      description:
        '100% roasted peanuts - nothing else. High in protein and healthy fats. Perfect for sandwiches, smoothies, or straight from the jar. No palm oil, no trans fats.',
      heroImage: '/images/products/peanut-butter.jpg',
      nutritionJson: {
        per100g: {
          energy: '588 kcal',
          protein: '25g',
          carbs: '20g',
          sugar: '6g',
          fat: '50g',
          fiber: '6g',
        },
      },
      ingredientsText: 'Roasted Peanuts (100%)',
      allergensText: 'Peanuts',
      healthScore: 88,
      isPalmOilFree: true,
      isArtificialColorFree: true,
      isLowSugar: true,
      isMeetsStandard: true,
    },
  });

  const product4 = await prisma.product.create({
    data: {
      title: 'Slurrp Farm Ragi Pancake Mix',
      slug: 'slurrp-farm-ragi-pancake-mix',
      brandId: brands[2].id,
      categoryId: categories[4].id,
      shortSummary:
        'Nutritious pancake mix made with ragi (finger millet) and whole wheat flour.',
      description:
        'Make healthy pancakes in minutes with this kid-approved mix. Rich in calcium and iron from ragi. No artificial colors, flavors, or palm oil.',
      heroImage: '/images/products/ragi-pancake-mix.jpg',
      nutritionJson: {
        per100g: {
          energy: '360 kcal',
          protein: '10g',
          carbs: '72g',
          sugar: '12g',
          fat: '3g',
          fiber: '5g',
        },
      },
      ingredientsText:
        'Ragi Flour (Finger Millet), Whole Wheat Flour, Jaggery, Banana Powder, Baking Powder',
      allergensText: 'Gluten',
      healthScore: 82,
      isPalmOilFree: true,
      isArtificialColorFree: true,
      isWholeGrain: true,
      isMeetsStandard: true,
    },
  });

  const product5 = await prisma.product.create({
    data: {
      title: 'Nourish Organics Quinoa Puffs',
      slug: 'nourish-organics-quinoa-puffs',
      brandId: brands[4].id,
      categoryId: categories[0].id,
      shortSummary: 'Light and crunchy quinoa puffs - a protein-rich snack for all ages.',
      description:
        'Organic quinoa puffed to perfection. Great as a snack or breakfast cereal. High in protein and gluten-free. No palm oil or artificial ingredients.',
      heroImage: '/images/products/quinoa-puffs.jpg',
      nutritionJson: {
        per100g: {
          energy: '370 kcal',
          protein: '14g',
          carbs: '64g',
          sugar: '2g',
          fat: '6g',
          fiber: '7g',
        },
      },
      ingredientsText: 'Organic Quinoa',
      allergensText: 'None',
      healthScore: 92,
      isPalmOilFree: true,
      isArtificialColorFree: true,
      isLowSugar: true,
      isMeetsStandard: true,
    },
  });

  const products = [product1, product2, product3, product4, product5];
  console.log('✅ Created products');

  // Assign Badges to Products
  await prisma.productBadge.createMany({
    data: [
      { productId: product1.id, badgeId: badges[0].id, rationale: 'No palm oil used' },
      { productId: product1.id, badgeId: badges[1].id, rationale: 'Only 3g sugar per 100g' },
      {
        productId: product1.id,
        badgeId: badges[3].id,
        rationale: 'No artificial colors or flavors',
      },
      { productId: product2.id, badgeId: badges[0].id, rationale: 'Palm oil free' },
      { productId: product2.id, badgeId: badges[2].id, rationale: 'Made from whole oats' },
      { productId: product3.id, badgeId: badges[0].id, rationale: '100% natural peanuts only' },
      { productId: product3.id, badgeId: badges[1].id, rationale: 'No added sugar' },
      { productId: product4.id, badgeId: badges[0].id, rationale: 'No palm oil' },
      { productId: product4.id, badgeId: badges[2].id, rationale: 'Whole grain ragi and wheat' },
      { productId: product5.id, badgeId: badges[0].id, rationale: 'Pure quinoa only' },
      { productId: product5.id, badgeId: badges[1].id, rationale: 'Only 2g natural sugar' },
    ],
  });
  console.log('✅ Assigned badges to products');

  // Create Affiliate Links
  await prisma.affiliateLink.createMany({
    data: products.flatMap((product) => [
      {
        productId: product.id,
        merchant: 'AMAZON',
        url: `https://www.amazon.in/dp/EXAMPLE${product.slug.substring(0, 5)}`,
        isActive: true,
      },
      {
        productId: product.id,
        merchant: 'FLIPKART',
        url: `https://www.flipkart.com/product/${product.slug}`,
        isActive: true,
      },
    ]),
  });
  console.log('✅ Created affiliate links');

  // Create Articles
  await prisma.article.createMany({
    data: [
      {
        title: 'Why Palm Oil in Snacks is a Problem (and Better Alternatives)',
        slug: 'why-palm-oil-in-snacks-is-a-problem',
        excerpt:
          'Palm oil is found in many packaged snacks, but its production has serious environmental and health implications. Learn what to look for and healthier alternatives.',
        bodyMarkdown: `# Why Palm Oil in Snacks is a Problem

Palm oil has become one of the most widely used vegetable oils in the world, found in everything from cookies to crackers. But is it good for you or the planet?

## Environmental Impact

The cultivation of palm oil is a leading cause of deforestation in Indonesia and Malaysia, destroying habitats for endangered species like orangutans, tigers, and elephants.

## Health Concerns

While palm oil itself isn't inherently unhealthy, it's high in saturated fats. The real issue is that snacks containing palm oil often undergo processes that create trans fats.

## Better Alternatives

Look for snacks made with:
- Coconut oil
- Olive oil
- Rice bran oil
- No added oils (baked or air-fried)

## Reading Labels

Palm oil hides under many names: vegetable oil, palmitate, glyceryl, stearate. Always check the ingredients list carefully.
`,
        coverImage: '/images/articles/palm-oil-problem.jpg',
        category: 'Ingredients 101',
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date('2024-01-15'),
        authorId: adminUser.id,
      },
      {
        title: 'How to Read Nutrition Labels Quickly: A 30-Second Guide',
        slug: 'how-to-read-nutrition-labels-quickly',
        excerpt:
          'Master the art of reading nutrition labels in under 30 seconds. Focus on what matters most for your health.',
        bodyMarkdown: `# How to Read Nutrition Labels Quickly

Shopping for healthy food doesn't have to take forever. Here's what to check in 30 seconds.

## The 3-Step Quick Scan

### 1. Check the Ingredients (5 seconds)
- Shorter is better
- Real food names you recognize
- Watch for: palm oil, HFCS, artificial colors (numbered dyes)

### 2. Sugar Content (10 seconds)
- Look at "Total Sugar" per 100g
- Under 5g = Low sugar
- Over 15g = High sugar
- Remember: 4g sugar = 1 teaspoon

### 3. Fiber & Protein (15 seconds)
- Higher fiber = better (aim for 3g+ per serving)
- Higher protein = more filling
- Check the serving size (often unrealistically small!)

## Red Flags
- Partially hydrogenated oils (trans fats)
- Long chemical names
- Palm oil or derivatives
- High sodium (over 400mg per 100g)

## The Bottom Line

Focus on whole food ingredients, low sugar, and reasonable serving sizes. If the ingredients list reads like a chemistry experiment, put it back on the shelf.
`,
        coverImage: '/images/articles/nutrition-labels.jpg',
        category: 'Label Literacy',
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date('2024-02-01'),
        authorId: adminUser.id,
      },
      {
        title: 'Healthy Tiffin Ideas for Kids: Nutritious & Delicious',
        slug: 'healthy-tiffin-ideas-for-kids',
        excerpt:
          'Pack school lunches your kids will actually eat - nutritious recipes that are fun, colorful, and palm-oil-free.',
        bodyMarkdown: `# Healthy Tiffin Ideas for Kids

Getting kids to eat healthy can be challenging, especially when competing with colorful packaged snacks. Here are ideas that work.

## Monday: Rainbow Veggie Wrap
- Whole wheat tortilla
- Hummus spread
- Shredded carrots, purple cabbage, cucumber
- Grilled paneer strips

## Tuesday: Protein-Packed Ragi Dosa
- Made with ragi and urad dal
- Served with coconut chutney
- Side of cucumber sticks

## Wednesday: Quinoa & Veggie Pulao
- Quinoa base instead of rice
- Mixed vegetables
- Roasted peanuts for crunch
- A small portion of curd

## Thursday: Whole Grain Pasta Salad
- Whole wheat pasta
- Cherry tomatoes, corn, bell peppers
- Olive oil and herb dressing
- Boiled egg or chickpeas

## Friday: Nut Butter Sandwiches
- Whole grain bread
- Natural peanut or almond butter (no palm oil!)
- Banana slices
- A drizzle of honey

## Snack Ideas
- Roasted makhana (fox nuts)
- Fresh fruit
- Homemade trail mix (nuts + dried fruit)
- Whole grain crackers with cheese

## Pro Tips
1. Involve kids in packing
2. Use colorful lunch boxes
3. Pack a fun note
4. Keep variety high to prevent boredom
`,
        coverImage: '/images/articles/kids-tiffin.jpg',
        category: 'Kids Lunchbox',
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date('2024-02-10'),
        authorId: adminUser.id,
      },
    ],
  });
  console.log('✅ Created articles');

  // Create Evidence Entries
  await prisma.evidence.createMany({
    data: [
      {
        title: 'WHO Guidelines on Saturated Fatty Acid and Trans-Fatty Acid Intake',
        publisher: 'World Health Organization',
        year: 2023,
        url: 'https://www.who.int/publications/i/item/9789240073630',
        summary:
          'WHO recommends reducing saturated fatty acid intake to less than 10% of total energy intake and trans-fatty acid intake to less than 1% of total energy intake.',
        tagsJson: { tags: ['trans-fats', 'saturated-fat', 'WHO', 'guidelines'] },
      },
      {
        title: 'FSSAI Standards for Palm Oil in Food Products',
        publisher: 'Food Safety and Standards Authority of India',
        year: 2023,
        url: 'https://www.fssai.gov.in/',
        summary:
          'FSSAI mandates clear labeling of palm oil and its derivatives in packaged food products.',
        tagsJson: { tags: ['palm-oil', 'FSSAI', 'India', 'regulations'] },
      },
      {
        title: 'Health Effects of Dietary Fiber',
        publisher: 'American Journal of Clinical Nutrition',
        year: 2022,
        url: 'https://academic.oup.com/ajcn',
        summary:
          'High fiber intake is associated with reduced risk of cardiovascular disease, type 2 diabetes, and colorectal cancer.',
        tagsJson: { tags: ['fiber', 'whole-grains', 'health-benefits', 'research'] },
      },
      {
        title: 'Impact of High Sugar Consumption on Child Health',
        publisher: 'Pediatrics Journal',
        year: 2022,
        url: 'https://publications.aap.org/pediatrics',
        summary:
          'Excessive sugar consumption in children is linked to obesity, dental caries, and increased risk of metabolic syndrome.',
        tagsJson: { tags: ['sugar', 'children', 'obesity', 'health'] },
      },
      {
        title: 'Artificial Food Colors and Hyperactivity in Children',
        publisher: 'The Lancet',
        year: 2021,
        url: 'https://www.thelancet.com/',
        summary:
          'Meta-analysis suggests artificial food colors may increase hyperactivity in susceptible children.',
        tagsJson: { tags: ['artificial-colors', 'children', 'hyperactivity', 'additives'] },
      },
      {
        title: 'Whole Grains and Chronic Disease Prevention',
        publisher: 'British Medical Journal',
        year: 2023,
        url: 'https://www.bmj.com/',
        summary:
          'Regular consumption of whole grains is associated with lower risk of coronary heart disease, type 2 diabetes, and certain cancers.',
        tagsJson: { tags: ['whole-grains', 'prevention', 'chronic-disease'] },
      },
    ],
  });
  console.log('✅ Created evidence entries');

  // Create Ingredients
  await prisma.ingredient.createMany({
    data: [
      {
        name: 'Palm Oil',
        slug: 'palm-oil',
        description: `Palm oil is a vegetable oil derived from the fruit of oil palm trees. While not inherently unhealthy, its production is a major cause of deforestation in Southeast Asia. From a health perspective, it's high in saturated fats (about 50%), which may raise LDL cholesterol when consumed in excess. Many processed foods use refined palm oil, which undergoes processing that can create harmful compounds.`,
        aliasesJson: {
          aliases: [
            'Vegetable Oil (if from palm)',
            'Palmitic Acid',
            'Palmate',
            'Palmitate',
            'Palm Kernel Oil',
            'Sodium Lauryl Sulfate',
            'Glyceryl Stearate',
          ],
        },
        riskLevel: RiskLevel.MODERATE,
        referencesJson: {
          references: [
            'WHO Guidelines on Saturated Fatty Acids',
            'FSSAI Palm Oil Standards',
          ],
        },
      },
      {
        name: 'Hydrogenated Oils (Trans Fats)',
        slug: 'hydrogenated-oils',
        description: `Hydrogenated oils are created by adding hydrogen to liquid vegetable oils to make them more solid and increase shelf life. This process creates trans fats, which are extremely harmful. Trans fats raise LDL (bad) cholesterol while lowering HDL (good) cholesterol, significantly increasing heart disease risk. WHO recommends eliminating industrially-produced trans fats from the food supply.`,
        aliasesJson: {
          aliases: [
            'Partially Hydrogenated Oil',
            'Hydrogenated Vegetable Oil',
            'Shortening',
            'Vanaspati',
          ],
        },
        riskLevel: RiskLevel.HIGH,
        referencesJson: {
          references: ['WHO Trans Fat Guidelines', 'FSSAI Trans Fat Regulations'],
        },
      },
      {
        name: 'Artificial Colors',
        slug: 'artificial-colors',
        description: `Artificial food colors are synthetic dyes used to make food more visually appealing. Common ones include Tartrazine (Yellow 5), Sunset Yellow (Yellow 6), and Carmoisine (Red 3). Studies suggest some artificial colors may cause hyperactivity in susceptible children. The EU requires warning labels on foods with certain artificial colors. Natural alternatives include turmeric, beetroot, and spirulina.`,
        aliasesJson: {
          aliases: [
            'FD&C Colors',
            'Tartrazine',
            'E102',
            'E110',
            'Sunset Yellow',
            'Carmoisine',
            'E122',
          ],
        },
        riskLevel: RiskLevel.MODERATE,
        referencesJson: {
          references: ['The Lancet Study on Artificial Colors', 'FSSAI Permitted Colors List'],
        },
      },
      {
        name: 'Whole Grain Flour',
        slug: 'whole-grain-flour',
        description: `Whole grain flour contains all three parts of the grain: bran, germ, and endosperm. This makes it much more nutritious than refined flour, with higher fiber, vitamins, minerals, and antioxidants. Regular consumption of whole grains is associated with reduced risk of heart disease, diabetes, and certain cancers. Look for "100% whole grain" or "100% whole wheat" on labels.`,
        aliasesJson: {
          aliases: ['Whole Wheat Flour', 'Whole Grain Atta', 'Graham Flour', 'Whole Ragi'],
        },
        riskLevel: RiskLevel.LOW,
        referencesJson: {
          references: ['BMJ Whole Grains Study', 'American Heart Association Guidelines'],
        },
      },
    ],
  });
  console.log('✅ Created ingredient entries');

  console.log('✅ Database seeded successfully!');
  console.log(`📧 Admin login: ${adminEmail}`);
  console.log(`🔑 Admin password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
