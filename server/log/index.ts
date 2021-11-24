/**
 * @param label Provide some info about the value.
 * @param value The data being logged.
 * @param id Optional info about the object the value is located in.
 */
type Log = <Value>(label: string, value: Value, id?: unknown) => Value

export default Log
