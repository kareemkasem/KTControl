### The `incentive` Collection: 

1. run the following command in the terminal to enforce the Schema:
```js
db.runCommand({collMod: "incentive", validator: {
    $jsonSchema: {
        bsonType: 'object',
            required: [
            'month',
            'employee',
            'details'
        ],
            properties: {
            month: {
                bsonType: 'string',
                    description: 'a string representation of the month in string format as such \'11/2023\' must be provided'
            },
            employee: {
                bsonType: 'number',
                    description: 'the employee code that would be referenced in the query must be provided as a number'
            },
            details: {
                bsonType: 'array',
                    description: 'an array of the incentive items for this employee',
                    items: [
                    {
                        bsonType: 'object',
                        description: 'the incentive item for an employee must be provided',
                        required: [
                            'item',
                            'quantity'
                        ],
                        properties: {
                            item: {
                                bsonType: 'objectId',
                                description: 'a reference to the incentive item must be provided'
                            },
                            quantity: {
                                bsonType: 'number',
                                description: 'the number representing the quantity sold by the employee for this item must be provided'
                            }
                        }
                    }
                ]
            }
        }
    }
}})
```

2. run this command in the terminal to make sure there is a unique entry for each month per employee:
```js
db.incentive.createIndex({employee: 1, month: 1}, {uniqe: true})
```