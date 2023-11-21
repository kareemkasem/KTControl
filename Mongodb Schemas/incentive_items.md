### The `incentive_items` Collection

1. run the following command in the terminal to enforce the Schema:
```js
db.runCommand({
    collMod: "incentive_items", validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                'name',
                'price',
                'incentive',
                'validTill'
            ],
            properties: {
                name: {
                    bsonType: 'string',
                    description: 'a name of type string must be provided'
                },
                price: {
                    bsonType: 'number',
                    description: 'a price of type number must be provided'
                },
                incentive: {
                    bsonType: 'number',
                    description: 'the incentive value of the item has to be provided and of type number'
                },
                validTill: {
                    bsonType: 'date',
                    description: 'the date till which this entry is valid must be provided and of type date'
                }
            }
        }
    }
})
```
2. run this command to give it a unique name
```ts
    db.incentive-items.createIndex({name: 1},{unique: true})
```