### The `employees` Collection:

1. run the following command in the terminal to enforce the schema
```js
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
```

2. run these commands separately in the terminal to make the code and username values unique:
```js
db.employees.createIndex({ code: 1 }, { unique: true });
db.employees.createIndex({ username: 1 }, { unique: true });
```
