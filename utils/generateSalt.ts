import bcrypt from "bcryptjs";

export async function generateSalt(): Promise<string> {
	try {
		return await bcrypt.genSalt(10)
	} catch (e) {
		throw e as Error;
	}
}
