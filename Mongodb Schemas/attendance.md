### The `attendane` Collection:

1. run the following command in the terminal to enforce the schema

```javascript
db.runCommand({
    collMod: "attendance",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["employee", "date", "month", "clockIn", "clockOut"],
            properties: {
                employee: {
                    bsonType: "number",
                    description: "employee code is required",
                },
                date: {
                    bsonType: "date",
                    description: "Date is required",
                },
                month: {
                    bsonType: "string",
                    description: "a string representation of the month in string format as such \'11/2023\' must be provided",
                },
                clockIn: {
                    bsonType: "string",
                    description: "ClockIn is required",
                },
                clockOut: {
                    bsonType: "string",
                    description: "ClockOut is required",
                }
            }
    }
}})
```

2. run this command in the terminal to make sure there is a unique entry for each month per employee:
```js
db.incentive.createIndex({employee: 1, month: 1}, {uniqe: true})
```
