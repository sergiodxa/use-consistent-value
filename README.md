# useConsistentValue

Keep a consistent reference to an object or array based on their values. Useful when using them as dependencies of an useEffect, useMemo or useCallback hooks.

## Usage

Install it

```sh
$ yarn add use-consistent-value
```

Import it

```ts
import useConsistentValue from 'use-consistent-value';
```

Use it inside a component

```ts
const [title, setState] = React.useState('');
const consistentValue = useConsistentValue({ title });
React.useEffect(() => {
  // do something with consistentValue
}, [consistentValue]);
```

## Custom compare function

By default, `useConsistentValue` uses `fast-deep-equal` to compare the stored value and the new value, this could be configured passing a `compare` function as second argument of the hook, useful when you want to check a less properties to know if it changed.

```ts
const consistentValue = useConsistentValue(
  { title, ignoredOnCompare },
  (a, b) => a.title === b.title
);
```

The `compare` function must return a boolean, with `true` in case the values are the same and `false` if they are not.
