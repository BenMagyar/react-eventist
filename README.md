# react-eventist
Attach pre/post async actions to React event handlers.

## Installation
react-eventist is only distributed as a CommonJS module and requires React 0.14
or later.

```
npm i --save react-eventist
```

## Documentation
### `<Eventist pre post>`
Makes the specified `pre` and `post` functions available to the
`connectEventist` calls.

#### `pre`/`post` `([event], [props], [next])`
The `pre`/`post` props are collections of functions that receive the handled
`event`, wrapped components `props`, and a `next` function. The `next` function
is called to move to the next action if available or to enter/exit the handler
if no intermediate steps remain.


#### Props
- `pre` - `Array<Function>` - Array of functions called before the event
  handler is called.
- `post` - `Array<Function>`- Array of functions called after the event
  handler is called.

#### Example
```
import { Eventist } from 'react-eventist'

const pre = [(event, props, next) => { console.log('before'); next(); }];
const after = [(event, props, next) => { console.log('after'); next(); }];

ReactDOM.render(
  <Eventist pre={pre} post={post}>
    <App />
  </Eventist>
)
```

### `createEventist([eventistKey])`
Creates an `Eventist` component with a unique `eventistKey` to allow for
secondary `Eventist` providers.

#### Parameters
- `eventistKey` - `String` - Unique key to be used to provide and receive
  the `pre`/`post` actions.

#### Example
```
import { createEventist } from 'react-eventist'
const HistoryEventist = createEventist('history')

const post = [(event, props, next) => { console.log('redirecting'); next() }];

ReactDOM.render(
  <HistoryEventist post={post}>
    <App />
  </HistoryEventist>
)
```

### `connectEventist([component], [handler], [options])`
Connects a component to the `Eventist` provider and runs all `pre`/`post`
functions on the specified `handler`. Allows for a custom `eventistKey` to be
provided through the `options`;

It also provides an `inProgress` prop to the wrapped component (can be changed
through the `mapInProgressToProps` option) that specifies if the component is
in any `pre`/`post` actions.

#### `options`
- `eventistKey` - `String?` - Optional key to connect to a custom Eventist
  Provider.
- `mapInProgressToProps` - `Function?` - Optional function to map the `inPre`
  and `inPost` state values to a prop for the wrapped component.

#### Example
```
import { connectEventist } from 'react-eventist'

const RouteButton = ({ onClick, inProgress }) =>
  <button type="button" onClick={onClick} disabled={inProgress}>
    Click
  </button>

export default connectEventist(RouteButton, 'onClick')
```

## License
MIT
