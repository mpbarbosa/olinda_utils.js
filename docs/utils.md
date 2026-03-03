# utils — General Utility Functions

**Module:** `core/utils`  
**Version:** 0.3.0  
**Type:** Pure Functions Only  
**Since:** 0.3.0

## Overview

Pure utility functions for strings, arrays, and objects.
All functions are referentially transparent — deterministic output, no side effects.

Import from the package root:

```typescript
import { camelCase, deepClone, isEmpty } from 'olinda_utils.js';
```

---

## String Utilities

### `camelCase(str)`

Convert a string to `camelCase`.

```typescript
camelCase('hello-world')  // 'helloWorld'
camelCase('hello_world')  // 'helloWorld'
camelCase(null)           // ''
```

### `kebabCase(str)`

Convert a string to `kebab-case`.

```typescript
kebabCase('helloWorld')  // 'hello-world'
```

### `snakeCase(str)`

Convert a string to `snake_case`.

```typescript
snakeCase('helloWorld')  // 'hello_world'
```

### `pascalCase(str)`

Convert a string to `PascalCase`.

```typescript
pascalCase('hello-world')  // 'HelloWorld'
```

### `capitalize(str)`

Capitalize the first letter.

```typescript
capitalize('hello')  // 'Hello'
```

### `truncate(str, length, suffix?)`

Truncate to `length` characters, appending `suffix` (default `'...'`).

```typescript
truncate('hello world', 8)        // 'hello...'
truncate('hello world', 8, '…')   // 'hello w…'
```

### `sanitize(str, allowed?)`

Keep only alphanumeric characters plus the `allowed` set (default `'-_'`).

```typescript
sanitize('hello@world!')           // 'helloworld'
sanitize('hello-world_test', '-_') // 'hello-world_test'
```

### `cleanWhitespace(str)`

Collapse consecutive whitespace and trim.

```typescript
cleanWhitespace('hello    world')  // 'hello world'
```

### `escapeRegex(str)`

Escape all regex metacharacters.

```typescript
escapeRegex('hello.world')  // 'hello\\.world'
```

---

## Array Utilities

### `dedupe(arr)`

Remove duplicate values.

```typescript
dedupe([1, 2, 2, 3])  // [1, 2, 3]
```

### `chunk(arr, size)`

Split into fixed-size chunks.

```typescript
chunk([1, 2, 3, 4, 5], 2)  // [[1,2],[3,4],[5]]
```

### `flatten(arr, depth?)`

Recursively flatten a nested array (default depth: `Infinity`).

```typescript
flatten([1, [2, [3, 4]]])     // [1, 2, 3, 4]
flatten([1, [2, [3, 4]]], 1)  // [1, 2, [3, 4]]
```

### `groupBy(arr, keyOrFn)`

Group elements by a property name or function.

```typescript
groupBy([{t:'a'},{t:'b'},{t:'a'}], 'type')  // {a:[...], b:[...]}
groupBy([1,2,3,4], n => n%2===0 ? 'even' : 'odd')
```

### `sortBy(arr, keyOrFn, order?)`

Return a sorted copy (default `'asc'`; also accepts `'desc'`).

```typescript
sortBy([{age:30},{age:20}], 'age')         // [{age:20},{age:30}]
sortBy([{age:30},{age:20}], 'age', 'desc') // [{age:30},{age:20}]
```

### `intersection(...arrays)`

Return elements present in every array.

```typescript
intersection([1,2,3],[2,3,4],[3,4,5])  // [3]
```

### `difference(arr1, arr2)`

Return elements in `arr1` not in `arr2`.

```typescript
difference([1,2,3],[2,3,4])  // [1]
```

### `partition(arr, predicate)`

Split into `[truthy, falsy]` based on a predicate.

```typescript
partition([1,2,3,4,5], n => n%2===0)  // [[2,4],[1,3,5]]
```

---

## Object Utilities

### `deepClone(obj)`

Create an independent deep copy (handles plain objects, arrays, `Date`).

```typescript
const clone = deepClone({a:{b:1}})  // {a:{b:1}} — new reference
```

### `deepMerge(target, ...sources)`

Deep-merge sources into a clone of `target` without mutating it.

```typescript
deepMerge({a:{b:1}},{a:{c:2}})  // {a:{b:1,c:2}}
```

### `pick(obj, keys)`

Create a new object with only the specified keys.

```typescript
pick({a:1,b:2,c:3}, ['a','c'])  // {a:1,c:3}
```

### `omit(obj, keys)`

Create a new object with the specified keys removed.

```typescript
omit({a:1,b:2,c:3}, ['b'])  // {a:1,c:3}
```

### `getProperty(obj, path, defaultValue?)`

Read a nested property via dot-notation path.

```typescript
getProperty({user:{name:'John'}}, 'user.name')          // 'John'
getProperty({user:{name:'John'}}, 'user.age', 'n/a')    // 'n/a'
```

### `setProperty(obj, path, value)`

Set a nested property via dot-notation path, returning a new object.

```typescript
setProperty({}, 'a.b.c', 42)  // {a:{b:{c:42}}}
```

### `hasProperty(obj, path)`

Check whether a nested property path exists.

```typescript
hasProperty({user:{name:'John'}}, 'user.name')   // true
hasProperty({user:{name:'John'}}, 'user.email')  // false
```

### `deepEqual(a, b)`

Structural equality for primitives, `Date`, plain objects, and arrays.

```typescript
deepEqual({a:{b:1}},{a:{b:1}})  // true
deepEqual([1,2],[1,2,3])        // false
```

### `isEmpty(value)`

Return `true` for `null`, `undefined`, blank string, empty array, empty object.
Note: `0` and `false` are **not** empty.

```typescript
isEmpty([])        // true
isEmpty({})        // true
isEmpty('  ')      // true
isEmpty(0)         // false
isEmpty(false)     // false
```
