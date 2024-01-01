### The `dayoff` Collection:

1. run the following command in the terminal to enforce the schema

```js
db.runCommand({
    collMod: "dayoff",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["employee", "date",],
            properties: {
                employee: {
                    bsonType: "number",
                    description: "provide the employee code number",
                },
                date: {
                    bsonType: "Date",
                    description: "must be a date and is required",
                },
                comment: {
                    bsonType: "string",
                    description: "must be a string",
                },
            },
        },
    },
});
```