// Adds starter roles, the current event and ticket types if those tables are empty.
// Run with: DOTENV_CONFIG_PATH=.env.local npx tsx scripts/seed-defaults.ts
import "dotenv/config";
import { db } from "@/lib/db";
import { events, roles, ticketTypes } from "@/lib/schema";
import { allPermissions } from "@/lib/permissions";

const viewOnly = allPermissions.filter((p) => p.endsWith(".view"));

async function seed() {
  if (!db) throw new Error("Database not configured");

  if ((await db.select().from(roles).limit(1)).length === 0) {
    await db.insert(roles).values([
      { name: "Administrator", description: "Full access to everything", permissions: allPermissions },
      { name: "Executive", description: "Can see everything and manage events, tasks and volunteers", permissions: [...viewOnly, "events.manage", "tasks.manage", "volunteers.manage"] },
      { name: "Volunteer Lead", description: "Coordinates volunteers and day-of tasks", permissions: ["volunteers.view", "volunteers.manage", "tasks.view", "tasks.manage", "tickets.view"] },
      { name: "Volunteer", description: "Can see their tasks", permissions: ["tasks.view"] },
    ]);
    console.log("Added roles");
  }

  if ((await db.select().from(events).limit(1)).length === 0) {
    await db.insert(events).values({
      name: "Evolution SZN",
      eventDate: "2026-12-29",
      venue: "Untamed Empire",
      timeLabel: "11:00 AM - 10:00 PM",
      ticketUrl: "https://chaleapp.com/eventcheck/teens-rave/137",
      isCurrent: true,
      status: "announced",
    });
    console.log("Added current event");
  }

  if ((await db.select().from(ticketTypes).limit(1)).length === 0) {
    const passes = [
      ["Single Pass", "Admits 1", "100", "150"],
      ["Squad Pass", "Admits 3 Squad", "279", "420"],
      ["Geng Pass", "Admits 5 Geng", "470", "700"],
    ];
    await db.insert(ticketTypes).values(
      passes.flatMap(([name, admits, general, vip], index) => [
        { name, admits, tier: "General Admission", price: general, sortOrder: index * 2 },
        { name, admits, tier: "VIP", price: vip, sortOrder: index * 2 + 1 },
      ])
    );
    console.log("Added ticket types");
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
