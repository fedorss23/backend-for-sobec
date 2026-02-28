import { google } from "googleapis";
import knex from "knex";
import env from "#config/env/env.js";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

class GoogleSheetService {
    private sheets: any;
    private currentSheetId: string | null = null;
    private currentDate: string | null = null;

    // constructor() {
    //     const jwtClient = new google.auth.JWT(env.GOOGLE_CLIENT_EMAIL, undefined, env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), SCOPES);
    //     this.sheets = google.sheets({ version: "v4", auth: jwtClient });
    // }

    private async getToday() {
        return new Date().toISOString().split("T")[0]
    }

    private async getTariffs(date: string) {
        return await knex("tariffs")
            .select(
                "date",
                "geo_name",
                "warehouse_name",
                "box_storage_base",
                "box_delivery_coef_expr",
                "box_delivery_marketplace_coef_expr",
                "box_storage_coef_expr",
            )
            .where("date", date);
    }

    private async formatForSheet(rows: any[]) {
        const header = [
            "date",
            "geo_name",
            "warehouse_name",
            "box_storage_base",
            "box_delivery_coef_expr",
            "box_delivery_marketplace_coef_expr",
            "box_storage_coef_expr",
        ];
        const data = rows.map((row) => [
            row.date?.toISOString?.().split("T")[0] ?? row.date,
            row.geo_name,
            row.warehouse_name,
            row.box_storage_base,
            row.box_delivery_coef_expr,
            row.box_delivery_marketplace_coef_expr,
            row.box_storage_coef_expr,
        ]);

        return [header, ...data];
    }

    private async createSheet(date: string) {
        const res = await this.sheets.spreadsheets.create({
            requestBody: {
                properties: { title: `Tariffs ${date}` },
            },
        });

        this.currentSheetId = res.data.spreadsheetId!;
        this.currentDate = date;
    }

    private async ensureDailySheet(date: string) {
        if (this.currentDate !== date || !this.currentSheetId) {
            await this.createSheet(date);
        }
    }

    async syncDailyTariffs() {
        const date = await this.getToday()

        const rows = await this.getTariffs(date);
        const values = this.formatForSheet(rows);
        
        await this.ensureDailySheet(date);

        await this.sheets.spreadsheets.values.update({
            spreadsheetId: this.currentSheetId,
            range: "stocks_coefs!A1",
            valueInputOption: "RAW",
            requestBody: { values },
        });

        console.log(`Google Sheet: ${this.currentSheetId}`);
    }
}

export const googleSheetService = new GoogleSheetService();
