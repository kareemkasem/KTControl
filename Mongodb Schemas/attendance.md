### The `attendane` Collection:

1. run the following command in the terminal to enforce the schema

```javascript
db.runCommand({
    collMod: "attendance",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["employee", "day", "clockIn", "clocOut"],
            properties: {
                employee: {
                    bsonType: "number",
                    description: "must be a number and is required"
                },
                day: {
                    bsonType: "date",
                    description: "must be a date and is required"
                },
                clockIn: {
                    bsonType: "date",
                    description: "must be a date and is required"
                },
                clockOut: {
                    bsonType: "date",
                    description: "must be a date and is required"
                },
            }
        }
    }
})
```

2. run this command in the terminal to make sure there is one entry for each day per employee:

```javascript
db.attendance.createIndex({employee: 1, day: 1}, {uniqe: true})
```