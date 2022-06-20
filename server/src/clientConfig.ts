import { db } from "./db.js";

export async function clientConfig(): Promise<string> {
    return JSON.stringify(
        await Promise.all((await db.all("SELECT id, type FROM els WHERE enabled = 1 ORDER BY zi"))
            .map(async _ => [
                _.id,
                _.type,
                (await db.all("SELECT prop, valueType, value FROM elProps WHERE el = ?", _.id))
                    .map(_ => ([_.prop, _.valueType, _.value]))
            ])))
}