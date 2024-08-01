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