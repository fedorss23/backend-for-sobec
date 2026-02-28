import { google } from "googleapis";
import knex from "knex";
import env from "#config/env/env.js";


const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];


class GoogleSheetService {
    // private sheets: any;
    // private sheetIds: string[];

    // constructor() {
    //     const jwtClient = new google.auth.JWT(env.GOOGLE_CLIENT_EMAIL, undefined, env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), SCOPES);

    //     this.sheets = google.sheets({ version: "v4", auth: jwtClient });
    //     this.sheetIds = env.GOOGLE_SHEET_IDS.split(",");
    // }

    // private async getTariffs() {
    //     return (await knex("tariffs").select("*"));
    // }

    // private async formatForSheet(rows: any[]) {
    //     const header = [
    //         "date",
    //         "geo_name",
    //         "warehouse_name",
    //         "box_storage_base",
    //         "box_delivery_coef_expr",
    //         "box_delivery_marketplace_coef_expr",
    //         "box_storage_coef_expr",
    //     ];
    //     const data = rows.map((row) => [
    //         row.date?.toISOString?.().split("T")[0] ?? row.date,
    //         row.geo_name,
    //         row.warehouse_name,
    //         row.box_storage_base,
    //         row.box_delivery_coef_expr,
    //         row.box_delivery_marketplace_coef_expr,
    //         row.box_storage_coef_expr,
    //     ]);

    //     return [header, ...data];
    // }

    // private async updateSheet(sheetId: string) {
    //     const rows = await this.getTariffs();
    //     const values = this.formatForSheet(rows);

    //     await this.sheets.spreadsheets.values.update({
    //         spreadsheetId: sheetId,
    //         range: "stocks_coefs!A1",
    //         valueInputOption: "RAW",
    //         requestBody: { values },
    //     });

    //     console.log(`Google Sheet updated: ${sheetId}`);
    // }

    // async syncSheets() {
    //     for (const sheetId of this.sheetIds) {
    //         try {
    //             await this.updateSheet(sheetId);
    //         } catch (err) {
    //             console.error(`Failed to update sheet ${sheetId}:`, err);
    //         }
    //     }
    // }
}

export const googleSheetService = new GoogleSheetService();
