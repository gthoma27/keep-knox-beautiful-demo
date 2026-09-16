/* eslint-disable no-console */
// Seeds the local MongoDB database with sample data (admin, volunteers, events)
// so the app has something to show when you run it locally.
//
// Usage: yarn seed

import fs from "fs";
import path from "path";

// Next.js loads .env.local automatically, but this script runs outside of
// Next.js via ts-node, so we load it by hand here.
function loadEnvLocal() {
    const envPath = path.resolve(__dirname, "..", ".env.local");
    if (!fs.existsSync(envPath)) return;
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        const value = trimmed.slice(eq + 1).trim();
        if (!(key in process.env)) process.env[key] = value;
    }
}
loadEnvLocal();

/* eslint-disable import/first */
import mongoose from "mongoose";
import { hash } from "bcrypt";
import AdminSchema from "./models/Admin";
import EventSchema from "./models/Event";
import VolunteerSchema from "./models/Volunteer";

const DB_URL = process.env.MONGO_DB ?? "mongodb://localhost:27017/keep-knox-beautiful";

const SEED_ADMIN = {
    email: "admin@example.com",
    password: "Password123!",
};

const VOLUNTEER_NAMES: [string, string][] = [
    ["Jane", "Doe"],
    ["Marcus", "Reed"],
    ["Aaliyah", "Brooks"],
    ["Ethan", "Coleman"],
    ["Priya", "Natarajan"],
    ["Liam", "Sanders"],
    ["Sofia", "Ramirez"],
    ["Noah", "Whitfield"],
    ["Grace", "Kim"],
    ["Caleb", "Osborne"],
    ["Maya", "Thompson"],
    ["Jackson", "Lee"],
    ["Harper", "Nguyen"],
    ["Elijah", "Carter"],
    ["Zoe", "Patterson"],
    ["Wyatt", "Foster"],
    ["Nora", "Bennett"],
    ["Isaac", "Alvarez"],
    ["Lily", "Simmons"],
    ["Owen", "Hayes"],
    ["Ava", "Mitchell"],
    ["Mason", "Perry"],
    ["Ella", "Douglas"],
    ["Logan", "Barrett"],
];

const EVENT_TEMPLATES = [
    {
        name: "World's Fair Park Litter Cleanup",
        caption: "A morning of community cleanup and beautification.",
        description:
            "<p>Join us for a morning of litter cleanup and beautification around World's Fair Park. All supplies provided!</p>",
        location: "World's Fair Park, Knoxville, TN",
        hours: 3,
        maxVolunteers: 20,
    },
    {
        name: "Ijams Nature Center Trail Restoration",
        caption: "Help restore trails at Knoxville's favorite nature preserve.",
        description:
            "<p>We'll be clearing brush, repairing erosion damage, and re-marking trails at Ijams Nature Center.</p>",
        location: "Ijams Nature Center, Knoxville, TN",
        hours: 4,
        maxVolunteers: 25,
    },
    {
        name: "First Creek Greenway River Cleanup",
        caption: "Pull litter and debris out of First Creek.",
        description:
            "<p>Waders and grabbers provided. Help keep First Creek Greenway clean for wildlife and walkers alike.</p>",
        location: "First Creek Greenway, Knoxville, TN",
        hours: 3,
        maxVolunteers: 15,
    },
    {
        name: "Community Tree Planting Day",
        caption: "Plant native trees across East Knoxville.",
        description:
            "<p>We're planting 100 native saplings across East Knoxville neighborhoods. No experience necessary.</p>",
        location: "Chilhowee Park, Knoxville, TN",
        hours: 4,
        maxVolunteers: 30,
    },
    {
        name: "Adopt-a-Street: Magnolia Avenue",
        caption: "Keep Magnolia Avenue litter-free.",
        description: "<p>Monthly cleanup along Magnolia Avenue as part of our Adopt-a-Street program.</p>",
        location: "Magnolia Avenue, Knoxville, TN",
        hours: 2,
        maxVolunteers: 12,
    },
    {
        name: "Downtown Storm Drain Stenciling",
        caption: "Stencil storm drains to prevent illegal dumping.",
        description:
            "<p>We'll be stenciling 'Dump No Waste - Drains to River' on storm drains across downtown Knoxville.</p>",
        location: "Downtown Knoxville, TN",
        hours: 2,
        maxVolunteers: 10,
    },
    {
        name: "Fort Dickerson Quarry Cleanup",
        caption: "Cleanup and invasive plant removal at the quarry.",
        description:
            "<p>Help remove litter and invasive plant species around the Fort Dickerson quarry and trails.</p>",
        location: "Fort Dickerson Park, Knoxville, TN",
        hours: 3,
        maxVolunteers: 20,
    },
    {
        name: "Community Garden Build Day",
        caption: "Build raised beds for a new neighborhood garden.",
        description: "<p>We're building 15 raised garden beds for a new community garden in South Knoxville.</p>",
        location: "South Knoxville Community Garden, Knoxville, TN",
        hours: 5,
        maxVolunteers: 18,
    },
    {
        name: "Volunteer Landing Riverfront Cleanup",
        caption: "Spruce up the riverfront for spring.",
        description: "<p>Litter pickup, mulching, and flower bed refresh along Volunteer Landing.</p>",
        location: "Volunteer Landing, Knoxville, TN",
        hours: 3,
        maxVolunteers: 20,
    },
    {
        name: "Mary Vestal Park Beautification",
        caption: "Flower planting and general park cleanup.",
        description: "<p>Help us plant flowers, mulch beds, and pick up litter at Mary Vestal Park.</p>",
        location: "Mary Vestal Park, Knoxville, TN",
        hours: 3,
        maxVolunteers: 15,
    },
    {
        name: "Fourth and Gill Neighborhood Cleanup",
        caption: "Quarterly neighborhood-wide cleanup.",
        description:
            "<p>Join neighbors for our quarterly litter pickup across the Fourth and Gill Historic District.</p>",
        location: "Fourth and Gill, Knoxville, TN",
        hours: 2,
        maxVolunteers: 25,
    },
    {
        name: "Earth Day Festival Cleanup Crew",
        caption: "Support Knoxville's Earth Day festival.",
        description:
            "<p>Volunteer with recycling sorting and site cleanup during Knoxville's annual Earth Day festival.</p>",
        location: "World's Fair Park, Knoxville, TN",
        hours: 6,
        maxVolunteers: 35,
    },
    {
        name: "Sharp's Ridge Overlook Trail Day",
        caption: "Trail maintenance with a view.",
        description: "<p>Clear overgrowth and repair erosion along the Sharp's Ridge overlook trails.</p>",
        location: "Sharp's Ridge Memorial Park, Knoxville, TN",
        hours: 4,
        maxVolunteers: 20,
    },
    {
        name: "Fall Leaf Litter & Recycling Drive",
        caption: "Neighborhood recycling drive and cleanup.",
        description: "<p>Collect recyclables and clear storm drains ahead of fall leaf season.</p>",
        location: "Fountain City Park, Knoxville, TN",
        hours: 3,
        maxVolunteers: 20,
    },
];

const DAY = 24 * 60 * 60 * 1000;

async function main() {
    await mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    } as mongoose.ConnectionOptions);
    console.log(`Connected to ${DB_URL}`);

    await Promise.all([AdminSchema.deleteMany({}), EventSchema.deleteMany({}), VolunteerSchema.deleteMany({})]);
    console.log("Cleared existing admins, events, and volunteers.");

    const hashedPassword = await hash(SEED_ADMIN.password, 10);
    await AdminSchema.create({ email: SEED_ADMIN.email, password: hashedPassword });
    console.log(`Created admin: ${SEED_ADMIN.email}`);

    const volunteers = await VolunteerSchema.insertMany(
        VOLUNTEER_NAMES.map(([first, last], i) => ({
            name: `${first} ${last}`,
            email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
            phone: `(865) 555-${String(1000 + i).slice(-4)}`,
            totalEvents: 0,
            totalHours: 0,
            registeredEvents: [],
            attendedEvents: [],
        }))
    );
    console.log(`Created ${volunteers.length} volunteers.`);

    const now = Date.now();
    const events = [];
    for (let i = 0; i < EVENT_TEMPLATES.length; i++) {
        const template = EVENT_TEMPLATES[i];
        // Spread events from ~35 days in the past to ~70 days in the future.
        const startOffsetDays = -35 + i * 8;
        const startDate = new Date(now + startOffsetDays * DAY);
        const endDate = new Date(startDate.getTime() + template.hours * 60 * 60 * 1000);
        const startRegistration = new Date(startDate.getTime() - 14 * DAY);
        const endRegistration = new Date(startDate.getTime() - 1 * DAY);
        const isPast = endDate.getTime() < now;

        // Deterministically pick a handful of volunteers for each event.
        const count = 3 + (i % 6);
        const chosen = Array.from({ length: count }, (_, j) => volunteers[(i * 5 + j) % volunteers.length]);

        const event = await EventSchema.create({
            ...template,
            startDate,
            endDate,
            startRegistration,
            endRegistration,
            groupSignUp: i % 4 === 0,
            registeredVolunteers: isPast ? [] : chosen.map(v => v._id as string),
            attendedVolunteers: isPast ? chosen.map(v => v._id as string) : [],
            volunteerCount: chosen.length,
        });
        events.push(event);

        for (const volunteer of chosen) {
            if (isPast) {
                volunteer.attendedEvents = [...(volunteer.attendedEvents ?? []), event._id];
                volunteer.totalEvents = (volunteer.totalEvents ?? 0) + 1;
                volunteer.totalHours = (volunteer.totalHours ?? 0) + template.hours;
            } else {
                volunteer.registeredEvents = [...(volunteer.registeredEvents ?? []), event._id];
            }
        }
    }
    await Promise.all(volunteers.map(v => v.save()));
    console.log(`Created ${events.length} events.`);

    console.log("\nSeed complete.");
    console.log(`Admin login -> email: ${SEED_ADMIN.email} / password: ${SEED_ADMIN.password}`);

    await mongoose.disconnect();
}

main().catch(error => {
    console.error("Seeding failed:", error);
    process.exit(1);
});
