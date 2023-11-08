import bcrypt from "bcryptjs";

export async function generateSalt(): Promise<string> {
	try {
		const salt = await bcrypt.genSalt(10);
		return salt;
	} catch (e) {
		throw e as Error;
	}
}
