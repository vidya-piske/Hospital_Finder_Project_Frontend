#how to use .env varaibles in another file
install: env-cmd
access using process.env.environment variable name


#Redux:
The counter's initial value is set to 0 in the Redux store.
Actions are created with a type property, such as { type: 'INCREMENT' } or { type: 'DECREMENT' }.
When you want to update the counter, you dispatch the action using dispatch(action). This sends the action to the Redux store.
The reducer function receives the action and the current state. It processes the action and returns a new state based on the action type (e.g., increment or decrement the counter value).
The Redux store updates its state based on the reducer’s return value. The new state is now available in the store.
The updated state reflects the changes (e.g., the counter value is updated).


Redux helps keep track of your app's data in one place, so different parts of your app can access and update the data consistently.

mapStateToProps: Gets data from the Redux store and provides it to a component.

mapDispatchToProps: Allows a component to send actions to the Redux store to update the data.

useDispatch: A hook that lets a component send actions to the Redux store.

useSelector: A hook that lets a component read data from the Redux store.

Key Differences
connect() vs. Hooks: mapStateToProps and mapDispatchToProps are used with the connect() function for class components or functional components. useDispatch and useSelector are used with React-Redux hooks in functional components.
Declarative vs. Imperative: mapStateToProps and mapDispatchToProps are more declarative, specifying how props are mapped. useDispatch and useSelector are more imperative, used directly in the component logic.
Component Types: connect() is commonly used with class components, while useDispatch and useSelector are designed for functional components with React Hooks.   



