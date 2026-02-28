import knex, { migrate, seed } from "#postgres/knex.js";
import cron from "node-cron";
import { wbService } from "#services/wb-service.js";
import { googleSheetService } from "#services/googlesheets-service.js";

async function waitForDb(retries = 10) {
    while (retries) {
        try {
            await knex.raw("SELECT 1");
            return;
        } catch (e) {
            console.log("Waiting for database...");
            retries--;
            await new Promise((res) => setTimeout(res, 3000));
        }
    }
    throw new Error("Database connection failed");
}

async function jobTarrifs() {
    try {
        const date = new Date().toISOString().split("T")
        await wbService.syncTariffs()
        console.log(`${date[0] + " | " + date[1].split(".")[0]}: save wb tariffs in db`)

        // await googleSheetService.syncDailyTariffs()
        // console.log(`${new Date().toISOString()}: load wb tariffs in google sheets`)
    } catch (e) {
        console.log("Error with loading tariffs:\n", e)
    }
}
async function bootstrap() {
    try {
        console.log("Starting application");

        await waitForDb();

        console.log("Running migrations");
        await migrate.latest();

        console.log("Starting cron jobs");

        console.log("Initial wb sync")
        await jobTarrifs()

        cron.schedule("0 * * * *", async () => {
            console.log("Start job tariffs")
            await jobTarrifs()
        });

        console.log("Service successfully started");
    } catch (error) {
        console.error("Fatal startup error:", error);
        process.exit(1);
    }
}

process.on("SIGINT", async () => {
    console.log("Shutting down");
    await knex.destroy();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("Container stopping");
    await knex.destroy();
    process.exit(0);
});

bootstrap();
