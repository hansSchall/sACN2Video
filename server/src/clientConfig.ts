import { db } from "./db.js";
import { joincomma } from "./utils";

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

export async function clientConfigV2(): Promise<string> {
    return joincomma(await Promise.all((await db.all("SELECT id, type FROM els WHERE enabled = 1 ORDER BY zi"))
        .map(async elItem => joincomma([
            elItem.id,
            elItem.type,
            joincomma(await Promise.all(
                (await db.all("SELECT prop, valueType, value FROM elProps WHERE el = ?", elItem.id))
                    .map(async ({ prop, valueType, value }) => {
                        const { input, output } = await db.get("SELECT input, output FROM propMapping WHERE el = ? AND prop = ?") || {
                            input: "",
                            output: ""
                        }
                        return joincomma([
                            prop, valueType, value, input, output
                        ]);
                    })
            ))
        ])
        )
    ))
}
