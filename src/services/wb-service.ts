import env from "#config/env/env.js";
import axios from "axios";
import knex from "#postgres/knex.js";

interface WbTariff {
  boxDeliveryBase: string;
  boxDeliveryCoefExpr: string;
  boxDeliveryLiter: string;
  boxDeliveryMarketplaceBase: string;
  boxDeliveryMarketplaceCoefExpr: string;
  boxDeliveryMarketplaceLiter: string;
  boxStorageBase: string;
  boxStorageCoefExpr: string;
  boxStorageLiter: string;
  geoName: string;
  warehouseName: string;
}

class WbService {
  private readonly API_URL =
    "https://common-api.wildberries.ru/api/v1/tariffs/box";

  async getTariffs(): Promise<WbTariff[]> {
    const today = new Date().toISOString().split("T")[0];

    const response = await axios.get(this.API_URL, {
      headers: {
        Authorization: `Bearer ${env.WB_API_TOKEN}`,
      },
      params: {
        date: today,
      },
      timeout: 10000,
    });

    return response.data?.response?.data?.warehouseList ?? [];
  }

  private toNumberFormat(value?: string): number | null {
    if (!value) return null;
    return Number(value.replace(",", "."));
  }

  async saveDailyTariffs(tariffs: WbTariff[]): Promise<void> {
    if (!tariffs.length) {
      console.log("No tariffs received from WB API");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const rows = tariffs.map((tariff) => ({
      date: today,
      geo_name: tariff.geoName,
      warehouse_name: tariff.warehouseName,

      box_delivery_coef_expr: this.toNumberFormat(
        tariff.boxDeliveryCoefExpr
      ),
      box_delivery_marketplace_coef_expr: this.toNumberFormat(
        tariff.boxDeliveryMarketplaceCoefExpr
      ),
      box_storage_base: this.toNumberFormat(tariff.boxStorageBase),
      box_storage_coef_expr: this.toNumberFormat(
        tariff.boxStorageCoefExpr
      ),
    }));

    await knex("tariffs")
      .insert(rows)
      .onConflict(["date", "geo_name", "warehouse_name"]) 
      .merge({
        box_delivery_coef_expr: knex.raw(
          "EXCLUDED.box_delivery_coef_expr"
        ),
        box_delivery_marketplace_coef_expr: knex.raw(
          "EXCLUDED.box_delivery_marketplace_coef_expr"
        ),
        box_storage_base: knex.raw("EXCLUDED.box_storage_base"),
        box_storage_coef_expr: knex.raw(
          "EXCLUDED.box_storage_coef_expr"
        ),
        updated_at: knex.fn.now(),
      });

  }

  async syncTariffs(): Promise<void> {
    try {
      const tariffs = await this.getTariffs();
      await this.saveDailyTariffs(tariffs);
      console.log(`Safe ${tariffs.length} tariffs in db`)
    } catch (error: any) {
      console.error("WB tariffs sync failed:", error?.response?.data || error.message);
    }
  }
}

export const wbService = new WbService();
