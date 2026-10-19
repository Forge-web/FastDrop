import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { join } from "node:path";

import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler( async (event) => {
	const user = await serverSupabaseUser(event);

	
})