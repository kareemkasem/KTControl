### The `attendane` Collection:

1. run the following command in the terminal to enforce the schema

```javascript
db.runCommand({
    collMod: "attendance",
    validator: {
        $jsonSchema: {

        }
    }
})
```