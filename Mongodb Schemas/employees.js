// * these commands are responsible for creating the Schema Validation and the index for the employees collection

db.runCommand({
	collMod: "employees",
	validator: {
		$jsonSchema: {
			bsonType: "object",
			required: ["code", "name", "username", "password", "title", "hourlyRate", "workHours"],
			description: "validation failed at top level",
			properties: {
				code: {
					bsonType: "number",
					description: "provide the employee code number",
				},
				name: {
					bsonType: "string",
					description: "must be a string and is required",
				},
				username: {
					bsonType: "string",
					description: "must be a string and is required",
				},
				password: {
					bsonType: "string",
					description: "must be a string and is required",
				},
				title: {
					bsonType: "string",
					description: "must be a string and is required",
				},
				hourlyRate: {
					bsonType: "number",
					description: "must be a number and is required",
				},
				workHours: {
					bsonType: "object",
					required: ["clockIn", "clockOut"],
					properties: {
						clockIn: {
							bsonType: "string",
							description: "must be a string and is required",
						},
						clockOut: {
							bsonType: "string",
							description: "must be a string and is required",
						},
					},
				},
			},
		},
	},
});

db.employees.createIndex({ code: 1 }, { unique: true });
db.employees.createIndex({ username: 1 }, { unique: true });
