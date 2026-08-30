<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Restaurant;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Table;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with complete, rich default data.
     */
    public function run(): void
    {
        // 1. Seed Admin User
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Restaurant Admin',
                'mobile' => '9876543210',
                'phone' => '9876543210',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active',
                'is_active' => true,
            ]
        );

        // 2. Seed Restaurant Profile
        $restaurant = Restaurant::firstOrCreate(
            ['email' => 'contact@gourmethaven.com'],
            [
                'user_id' => $admin->id,
                'name' => 'Gourmet Haven Fine Dining',
                'address' => '123 Grand View Boulevard, Connaught Place',
                'city' => 'New Delhi',
                'state' => 'Delhi',
                'pincode' => '110001',
                'phone' => '+91 98765 43210',
                'email' => 'contact@gourmethaven.com',
                'opening_time' => '11:00:00',
                'closing_time' => '23:00:00',
                'status' => 'active',
            ]
        );

        // 3. Seed Staff Users
        $staff1 = User::updateOrCreate(
            ['email' => 'rahul@example.com'],
            [
                'name' => 'Rahul Kumar',
                'mobile' => '9876543211',
                'phone' => '9876543211',
                'password' => Hash::make('password'),
                'role' => 'staff',
                'status' => 'active',
                'is_active' => true,
                'shift' => 'Morning',
            ]
        );

        $staff2 = User::updateOrCreate(
            ['email' => 'priya@example.com'],
            [
                'name' => 'Priya Sharma',
                'mobile' => '9876543212',
                'phone' => '9876543212',
                'password' => Hash::make('password'),
                'role' => 'staff',
                'status' => 'active',
                'is_active' => true,
                'shift' => 'Evening',
            ]
        );

        $staff3 = User::updateOrCreate(
            ['email' => 'amit@example.com'],
            [
                'name' => 'Amit Singh',
                'mobile' => '9876543213',
                'phone' => '9876543213',
                'password' => Hash::make('password'),
                'role' => 'staff',
                'status' => 'active',
                'is_active' => true,
                'shift' => 'Night',
            ]
        );

        // 4. Seed Food Categories
        $categoriesData = [
            [
                'name' => 'Starters & Appetizers',
                'description' => 'Delightful tandoori bites, crispy wings, and appetizers to kickstart your dining experience.',
                'status' => 'active',
            ],
            [
                'name' => 'Main Course',
                'description' => 'Rich royal curries, dum biryanis, slow-cooked lentils, and sizzling sizzlers.',
                'status' => 'active',
            ],
            [
                'name' => 'Breads & Naan',
                'description' => 'Freshly baked tandoori breads, butter garlic naans, and stuffed parathas.',
                'status' => 'active',
            ],
            [
                'name' => 'Desserts & Sweets',
                'description' => 'Traditional Indian delicacies, sizzling brownies, and chilled sundaes.',
                'status' => 'active',
            ],
            [
                'name' => 'Beverages & Drinks',
                'description' => 'Refreshing mocktails, mango lassi, fresh lemon soda, and chilled espresso.',
                'status' => 'active',
            ],
            [
                'name' => 'Chef Specials',
                'description' => 'Exquisite signature gourmet creations crafted by our executive master chef.',
                'status' => 'active',
            ],
        ];

        $categoriesMap = [];
        foreach ($categoriesData as $catData) {
            $cat = Category::firstOrCreate(
                [
                    'restaurant_id' => $restaurant->id,
                    'name' => $catData['name'],
                ],
                [
                    'description' => $catData['description'],
                    'status' => $catData['status'],
                ]
            );
            $categoriesMap[$catData['name']] = $cat->id;
        }

        // 5. Seed Food Menu Items
        $menuItemsData = [
            // Starters
            [
                'category' => 'Starters & Appetizers',
                'name' => 'Paneer Tikka',
                'description' => 'Tandoori marinated cottage cheese cubes grilled with colorful bell peppers and onions.',
                'price' => 260.00,
                'is_available' => true,
                'image' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80',
            ],
            [
                'category' => 'Starters & Appetizers',
                'name' => 'Crispy Chicken Wings',
                'description' => 'Juicy chicken wings tossed in spicy Indo-Chinese chili garlic sauce.',
                'price' => 290.00,
                'is_available' => true,
                'image' => 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&auto=format&fit=crop&q=80',
            ],
            [
                'category' => 'Starters & Appetizers',
                'name' => 'Hara Bhara Kabab',
                'description' => 'Nutritious patties made with fresh spinach, green peas, and paneer served with mint chutney.',
                'price' => 220.00,
                'is_available' => true,
                'image' => null,
            ],
            [
                'category' => 'Starters & Appetizers',
                'name' => 'Tandoori Mushroom',
                'description' => 'Button mushrooms stuffed with cheese and herbs, marinated in yogurt and spices.',
                'price' => 240.00,
                'is_available' => true,
                'image' => null,
            ],

            // Main Course
            [
                'category' => 'Main Course',
                'name' => 'Paneer Butter Masala',
                'description' => 'Soft cottage cheese cooked in a rich, creamy tomato and butter gravy with mild spices.',
                'price' => 320.00,
                'is_available' => true,
                'image' => 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80',
            ],
            [
                'category' => 'Main Course',
                'name' => 'Dal Makhani',
                'description' => 'Whole black lentils slow-cooked overnight on tandoor coals, finished with butter and cream.',
                'price' => 280.00,
                'is_available' => true,
                'image' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80',
            ],
            [
                'category' => 'Main Course',
                'name' => 'Chicken Biryani',
                'description' => 'Aromatic long-grain basmati rice dum cooked with tender chicken and secret spices.',
                'price' => 380.00,
                'is_available' => true,
                'image' => 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
            ],
            [
                'category' => 'Main Course',
                'name' => 'Butter Chicken',
                'description' => 'Charcoal-grilled chicken pieces simmered in a velvety tomato and cashew nut gravy.',
                'price' => 410.00,
                'is_available' => true,
                'image' => 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80',
            ],
            [
                'category' => 'Main Course',
                'name' => 'Mutton Rogan Josh',
                'description' => 'Tender lamb chunks braised in a traditional Kashmiri red chili and yogurt gravy.',
                'price' => 460.00,
                'is_available' => true,
                'image' => null,
            ],

            // Breads
            [
                'category' => 'Breads & Naan',
                'name' => 'Butter Naan',
                'description' => 'Soft and fluffy refined flour flatbread baked in clay oven and brushed with butter.',
                'price' => 60.00,
                'is_available' => true,
                'image' => null,
            ],
            [
                'category' => 'Breads & Naan',
                'name' => 'Garlic Naan',
                'description' => 'Leavened flatbread topped with minced garlic and fresh coriander leaves.',
                'price' => 80.00,
                'is_available' => true,
                'image' => null,
            ],
            [
                'category' => 'Breads & Naan',
                'name' => 'Tandoori Roti',
                'description' => 'Whole wheat flatbread baked directly on the inner clay walls of the tandoor.',
                'price' => 30.00,
                'is_available' => true,
                'image' => null,
            ],

            // Desserts
            [
                'category' => 'Desserts & Sweets',
                'name' => 'Gulab Jamun (2 Pcs)',
                'description' => 'Deep-fried golden milk solid spheres soaked in rose and cardamom scented sugar syrup.',
                'price' => 120.00,
                'is_available' => true,
                'image' => 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&auto=format&fit=crop&q=80',
            ],
            [
                'category' => 'Desserts & Sweets',
                'name' => 'Rasmalai (2 Pcs)',
                'description' => 'Soft cottage cheese discs floating in chilled saffron rabri garnished with pistachios.',
                'price' => 150.00,
                'is_available' => true,
                'image' => null,
            ],

            // Beverages
            [
                'category' => 'Beverages & Drinks',
                'name' => 'Fresh Lime Soda',
                'description' => 'Refreshing drink made with fresh lemon juice, mint leaves, rock salt, and sparkling soda.',
                'price' => 90.00,
                'is_available' => true,
                'image' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80',
            ],
            [
                'category' => 'Beverages & Drinks',
                'name' => 'Mango Lassi',
                'description' => 'Thick creamy yogurt smoothie blended with ripe sweet Alphonso mango pulp.',
                'price' => 120.00,
                'is_available' => true,
                'image' => null,
            ],
        ];

        $createdMenuItems = [];
        foreach ($menuItemsData as $itemData) {
            $catId = $categoriesMap[$itemData['category']] ?? null;
            if ($catId) {
                $item = MenuItem::firstOrCreate(
                    [
                        'restaurant_id' => $restaurant->id,
                        'name' => $itemData['name'],
                    ],
                    [
                        'category_id' => $catId,
                        'description' => $itemData['description'],
                        'price' => $itemData['price'],
                        'is_available' => $itemData['is_available'],
                        'image' => $itemData['image'],
                    ]
                );
                $createdMenuItems[$itemData['name']] = $item;
            }
        }

        // 6. Seed Dining Tables
        $tablesData = [
            ['table_number' => 'T01', 'capacity' => 4, 'status' => 'available'],
            ['table_number' => 'T02', 'capacity' => 2, 'status' => 'available'],
            ['table_number' => 'T03', 'capacity' => 6, 'status' => 'available'],
            ['table_number' => 'T04', 'capacity' => 4, 'status' => 'occupied'],
            ['table_number' => 'T05', 'capacity' => 8, 'status' => 'available'],
            ['table_number' => 'T06', 'capacity' => 2, 'status' => 'available'],
            ['table_number' => 'T07', 'capacity' => 4, 'status' => 'available'],
            ['table_number' => 'T08', 'capacity' => 6, 'status' => 'available'],
        ];

        $createdTables = [];
        foreach ($tablesData as $tblData) {
            $table = Table::firstOrCreate(
                [
                    'restaurant_id' => $restaurant->id,
                    'table_number' => $tblData['table_number'],
                ],
                [
                    'capacity' => $tblData['capacity'],
                    'status' => $tblData['status'],
                ]
            );
            $createdTables[$tblData['table_number']] = $table;
        }

        // 7. Seed Sample Orders for Order Management
        $table4 = $createdTables['T04'] ?? null;
        $table1 = $createdTables['T01'] ?? null;

        if ($table4 && isset($createdMenuItems['Butter Chicken'], $createdMenuItems['Garlic Naan'])) {
            $butterChicken = $createdMenuItems['Butter Chicken'];
            $garlicNaan = $createdMenuItems['Garlic Naan'];

            $subtotal = ($butterChicken->price * 1) + ($garlicNaan->price * 2); // 410 + 160 = 570
            $tax = round($subtotal * 0.05, 2); // 28.50
            $total = $subtotal + $tax;

            $order1 = Order::firstOrCreate(
                ['order_number' => 'ORD-1001'],
                [
                    'restaurant_id' => $restaurant->id,
                    'table_id' => $table4->id,
                    'staff_id' => $staff1->id,
                    'status' => 'preparing',
                    'subtotal' => $subtotal,
                    'tax' => $tax,
                    'discount' => 0.00,
                    'total' => $total,
                    'notes' => 'Make garlic naan extra crispy.',
                ]
            );

            OrderItem::firstOrCreate(
                [
                    'order_id' => $order1->id,
                    'menu_item_id' => $butterChicken->id,
                ],
                [
                    'quantity' => 1,
                    'price' => $butterChicken->price,
                    'subtotal' => $butterChicken->price * 1,
                    'notes' => 'Medium spicy',
                ]
            );

            OrderItem::firstOrCreate(
                [
                    'order_id' => $order1->id,
                    'menu_item_id' => $garlicNaan->id,
                ],
                [
                    'quantity' => 2,
                    'price' => $garlicNaan->price,
                    'subtotal' => $garlicNaan->price * 2,
                    'notes' => null,
                ]
            );
        }

        if ($table1 && isset($createdMenuItems['Paneer Butter Masala'], $createdMenuItems['Butter Naan'], $createdMenuItems['Mango Lassi'])) {
            $paneerBM = $createdMenuItems['Paneer Butter Masala'];
            $butterNaan = $createdMenuItems['Butter Naan'];
            $mangoLassi = $createdMenuItems['Mango Lassi'];

            $subtotal = ($paneerBM->price * 1) + ($butterNaan->price * 3) + ($mangoLassi->price * 2); // 320 + 180 + 240 = 740
            $tax = round($subtotal * 0.05, 2); // 37.00
            $total = $subtotal + $tax;

            $order2 = Order::firstOrCreate(
                ['order_number' => 'ORD-1000'],
                [
                    'restaurant_id' => $restaurant->id,
                    'table_id' => $table1->id,
                    'staff_id' => $staff2->id,
                    'status' => 'completed',
                    'subtotal' => $subtotal,
                    'tax' => $tax,
                    'discount' => 0.00,
                    'total' => $total,
                    'notes' => 'Served with extra mint chutney.',
                ]
            );

            OrderItem::firstOrCreate(
                [
                    'order_id' => $order2->id,
                    'menu_item_id' => $paneerBM->id,
                ],
                [
                    'quantity' => 1,
                    'price' => $paneerBM->price,
                    'subtotal' => $paneerBM->price * 1,
                    'notes' => null,
                ]
            );

            OrderItem::firstOrCreate(
                [
                    'order_id' => $order2->id,
                    'menu_item_id' => $butterNaan->id,
                ],
                [
                    'quantity' => 3,
                    'price' => $butterNaan->price,
                    'subtotal' => $butterNaan->price * 3,
                    'notes' => null,
                ]
            );

            OrderItem::firstOrCreate(
                [
                    'order_id' => $order2->id,
                    'menu_item_id' => $mangoLassi->id,
                ],
                [
                    'quantity' => 2,
                    'price' => $mangoLassi->price,
                    'subtotal' => $mangoLassi->price * 2,
                    'notes' => 'Less ice',
                ]
            );
        }
    }
}
