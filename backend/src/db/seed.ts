// AI generated for understanding the code 

import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import bcrypt from "bcrypt";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function main() {
  console.log("Starting database seeding with Indian names and test data...");

  try {
    // 1. Clean existing records in correct order of dependency
    console.log("Cleaning existing database tables...");
    await db.delete(schema.ratings);
    await db.delete(schema.stores);
    await db.delete(schema.users);
    console.log("Database cleaned.");

    // 2. Hash default password
    const passwordHash = await bcrypt.hash("Password123!", 10);

    // 3. Seed Users
    console.log("Seeding users...");
    const userRecords = await db
      .insert(schema.users)
      .values([
        // 1 System Administrator
        {
          name: "Aarav Sharma",
          email: "admin@test.com",
          address: "123 Admin Lane, Connaught Place, New Delhi",
          role: "ADMIN",
          password: passwordHash,
        },
        // 4 Store Owners
        {
          name: "Rajesh Kumar",
          email: "owner1@test.com",
          address: "Sector 15, Noida, Uttar Pradesh",
          role: "STORE_OWNER",
          password: passwordHash,
        },
        {
          name: "Priya Patel",
          email: "owner2@test.com",
          address: "MG Road, Bengaluru, Karnataka",
          role: "STORE_OWNER",
          password: passwordHash,
        },
        {
          name: "Amit Singh",
          email: "owner3@test.com",
          address: "Malviya Nagar, Jaipur, Rajasthan",
          role: "STORE_OWNER",
          password: passwordHash,
        },
        {
          name: "Sanjay Verma",
          email: "owner4@test.com",
          address: "Salt Lake, Kolkata, West Bengal",
          role: "STORE_OWNER",
          password: passwordHash,
        },
        // 15 Normal Users
        {
          name: "Rohan Mehta",
          email: "user1@test.com",
          address: "Andheri West, Mumbai, Maharashtra",
          role: "USER",
          password: passwordHash,
        },
        {
          name: "Sneha Reddy",
          email: "user2@test.com",
          address: "Jubilee Hills, Hyderabad, Telangana",
          role: "USER",
          password: passwordHash,
        },
        {
          name: "Aditi Rao",
          email: "user3@test.com",
          address: "Koregaon Park, Pune, Maharashtra",
          role: "USER",
          password: passwordHash,
        },
        {
          name: "Vikram Malhotra",
          email: "user4@test.com",
          address: "Vasant Kunj, New Delhi",
          role: "USER",
          password: passwordHash,
        },
        {
          name: "Neha Gupta",
          email: "user5@test.com",
          address: "Indiranagar, Bengaluru, Karnataka",
          role: "USER",
          password: passwordHash,
        },
        {
          name: "Arjun Kapoor",
          email: "user6@test.com",
          address: "Bandra West, Mumbai, Maharashtra",
          role: "USER",
          password: passwordHash,
        },
        {
          name: "Divya Joshi",
          email: "user7@test.com",
          address: "Satellite, Ahmedabad, Gujarat",
          role: "USER",
          password: passwordHash,
        },
        {
          name: "Yash Vardhan",
          email: "user8@test.com",
          address: "Hazratganj, Lucknow, Uttar Pradesh",
          role: "USER",
          password: passwordHash,
        },
        {
          name: "Kavita Nair",
          email: "user9@test.com",
          address: "Thrippunithura, Kochi, Kerala",
          role: "USER",
          password: passwordHash,
        },
        {
          name: "Manish Sharma",
          email: "user10@test.com",
          address: "Shastri Nagar, Patna, Bihar",
          role: "USER",
          password: passwordHash,
        },
        {
          name: "Pooja Mishra",
          email: "user11@test.com",
          address: "Boring Road, Patna, Bihar",
          role: "USER",
          password: passwordHash,
        },
        {
          name: "Rahul Dravid",
          email: "user12@test.com",
          address: "Jayanagar, Bengaluru, Karnataka",
          role: "USER",
          password: passwordHash,
        },
        {
          name: "Simran Kaur",
          email: "user13@test.com",
          address: "Sector 22, Chandigarh",
          role: "USER",
          password: passwordHash,
        },
        {
          name: "Alok Pandey",
          email: "user14@test.com",
          address: "Civil Lines, Prayagraj, Uttar Pradesh",
          role: "USER",
          password: passwordHash,
        },
        {
          name: "Riya Sen",
          email: "user15@test.com",
          address: "Park Street, Kolkata, West Bengal",
          role: "USER",
          password: passwordHash,
        },
      ])
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        role: schema.users.role,
      });

    console.log(`Successfully seeded ${userRecords.length} users.`);

    // Find users by email for reference
    const owner1 = userRecords.find((u) => u.email === "owner1@test.com")!;
    const owner2 = userRecords.find((u) => u.email === "owner2@test.com")!;
    const owner3 = userRecords.find((u) => u.email === "owner3@test.com")!;

    // 4. Seed Stores (3 stores, assigned to owners 1, 2, 3)
    console.log("Seeding stores...");
    const storeRecords = await db
      .insert(schema.stores)
      .values([
        {
          name: "Delhi Spice Bazaar",
          email: "contact@delhispicebazaar.com",
          address: "Chandni Chowk, New Delhi",
          ownerId: owner1.id,
        },
        {
          name: "Bengaluru Tech Hub",
          email: "contact@bengalurutechhub.com",
          address: "MG Road, Bengaluru, Karnataka",
          ownerId: owner2.id,
        },
        {
          name: "Jaipur Royal Crafts",
          email: "contact@jaipurroyalcrafts.com",
          address: "Johari Bazaar, Jaipur, Rajasthan",
          ownerId: owner3.id,
        },
      ])
      .returning({
        id: schema.stores.id,
        name: schema.stores.name,
      });

    console.log(`Successfully seeded ${storeRecords.length} stores.`);

    // 5. Seed Ratings & Reviews (Random ratings from normal users)
    console.log("Seeding random ratings and reviews...");
    const normalUsers = userRecords.filter((u) => u.role === "USER");
    const ratingsToInsert = [];

    const reviewsPool = [
      "Amazing place, highly recommend!",
      "Good experience, friendly staff.",
      "Decent, but service was slow.",
      "Not satisfied with the quality.",
      "Absolutely loved it, will visit again!",
      "Average experience, nothing special.",
      "Great value for money.",
      "Excellent customer service!",
      "Product range could be better.",
      "Loved the ambience and products."
    ];

    for (const store of storeRecords) {
      // Each store gets rated by a random selection of users (between 8 and 12 users)
      const numRatings = Math.floor(Math.random() * 5) + 8; // 8 to 12
      
      // Shuffle users
      const shuffledUsers = [...normalUsers].sort(() => 0.5 - Math.random());
      const selectedUsers = shuffledUsers.slice(0, numRatings);

      for (const user of selectedUsers) {
        const ratingVal = Math.floor(Math.random() * 5) + 1; // 1 to 5
        const reviewText = ratingVal >= 3 
          ? reviewsPool[Math.floor(Math.random() * reviewsPool.length)]
          : "Not a great experience, needs improvement.";

        ratingsToInsert.push({
          rating: ratingVal,
          review: reviewText,
          userId: user.id,
          storeId: store.id,
        });
      }
    }

    await db.insert(schema.ratings).values(ratingsToInsert);
    console.log(`Successfully seeded ${ratingsToInsert.length} random ratings and reviews.`);
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
