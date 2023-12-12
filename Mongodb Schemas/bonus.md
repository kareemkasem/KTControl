### The `bonus` Collection:

1. run the following command in the terminal to enforce the schema

```js
db.runCommand({
    collMod: "bonus",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["type", "amount", "comment", "month", "employee", "code", "approved"],
            properties: {
                type: {
                    enum: ["bonus", "deduction"],
                    description: "must be 'bonus' or 'deduction' and is required"
                },
                amount: {
                    bsonType: "number",
                    description: "must be a number and is required"
                },
                comment: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                month: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                employee: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                code: {
                    bsonType: "number",
                    description: "must be a number and is required"
                },
                approved: {
                    bsonType: "bool",
                    description: "must be a boolean and is required"
                }
            }
        }
    }
})
```