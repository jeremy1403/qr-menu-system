import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash('Admin1234', 10);
  await prisma.user.upsert({
    where: { email: 'admin@restaurant.com' },
    update: {},
    create: {
      email: 'admin@restaurant.com',
      password: hashedPassword,
      name: 'Admin',
      role: Role.ADMIN,
    },
  });

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'rice' },
      update: {},
      create: { name: 'Rice', slug: 'rice', description: 'Rice-based dishes', sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: 'noodles' },
      update: {},
      create: { name: 'Noodles', slug: 'noodles', description: 'Noodle-based dishes', sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: 'seafood' },
      update: {},
      create: { name: 'Seafood', slug: 'seafood', description: 'Fresh seafood dishes', sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: 'beverages' },
      update: {},
      create: { name: 'Beverages', slug: 'beverages', description: 'Drinks and beverages', sortOrder: 4 },
    }),
    prisma.category.upsert({
      where: { slug: 'desserts' },
      update: {},
      create: { name: 'Desserts', slug: 'desserts', description: 'Sweet desserts', sortOrder: 5 },
    }),
  ]);

  // Ingredients
  const ingredients = await Promise.all([
    'Rice', 'Coconut Milk', 'Anchovies', 'Egg', 'Cucumber',
    'Noodles', 'Soy Sauce', 'Garlic', 'Chili', 'Prawns',
    'Sugar', 'Milk', 'Ice', 'Pandan Leaf', 'Palm Sugar',
  ].map((name) =>
    prisma.ingredient.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  ));

  const ingredientMap = Object.fromEntries(ingredients.map((i) => [i.name, i]));

  // Menu Items
  const menuItemsData = [
    {
      name: 'Nasi Lemak',
      slug: 'nasi-lemak',
      description: 'Fragrant rice cooked in coconut milk served with anchovies, egg and cucumber.',
      price: 8.50,
      isFeatured: true,
      isPopular: true,
      categorySlug: 'rice',
      ingredients: ['Rice', 'Coconut Milk', 'Anchovies', 'Egg', 'Cucumber'],
    },
    {
      name: 'Fried Rice',
      slug: 'fried-rice',
      description: 'Wok-fried rice with egg, vegetables and soy sauce.',
      price: 7.00,
      isFeatured: false,
      isPopular: true,
      categorySlug: 'rice',
      ingredients: ['Rice', 'Egg', 'Soy Sauce', 'Garlic'],
    },
    {
      name: 'Char Kuey Teow',
      slug: 'char-kuey-teow',
      description: 'Stir-fried flat noodles with prawns, egg and chili.',
      price: 10.00,
      isFeatured: true,
      isPopular: true,
      categorySlug: 'noodles',
      ingredients: ['Noodles', 'Prawns', 'Egg', 'Chili', 'Soy Sauce'],
    },
    {
      name: 'Grilled Prawns',
      slug: 'grilled-prawns',
      description: 'Fresh prawns grilled with garlic butter and chili.',
      price: 18.00,
      isFeatured: true,
      isPopular: false,
      categorySlug: 'seafood',
      ingredients: ['Prawns', 'Garlic', 'Chili'],
    },
    {
      name: 'Teh Tarik',
      slug: 'teh-tarik',
      description: 'Classic Malaysian pulled milk tea.',
      price: 3.50,
      isFeatured: false,
      isPopular: true,
      categorySlug: 'beverages',
      ingredients: ['Milk', 'Sugar'],
    },
    {
      name: 'Cendol',
      slug: 'cendol',
      description: 'Traditional dessert with pandan jelly, coconut milk and palm sugar.',
      price: 5.00,
      isFeatured: true,
      isPopular: true,
      categorySlug: 'desserts',
      ingredients: ['Coconut Milk', 'Pandan Leaf', 'Palm Sugar', 'Ice'],
    },
  ];

  for (const item of menuItemsData) {
    const category = categories.find((c) => c.slug === item.categorySlug)!;
    const menuItem = await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        isFeatured: item.isFeatured,
        isPopular: item.isPopular,
        categoryId: category.id,
      },
    });

    for (const ingredientName of item.ingredients) {
      const ingredient = ingredientMap[ingredientName];
      await prisma.menuItemIngredient.upsert({
        where: {
          menuItemId_ingredientId: {
            menuItemId: menuItem.id,
            ingredientId: ingredient.id,
          },
        },
        update: {},
        create: {
          menuItemId: menuItem.id,
          ingredientId: ingredient.id,
        },
      });
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });