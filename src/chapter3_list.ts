export type element = any;

/***
 * Construct a pair
 * @param a: first element
 * @param b: second element
 * @returns a function that takes a function that takes two elements and returns one element
 */
export function pair(a: element, b: element): (s: (a: element, b: element) => element) => element
{
    return (select: (a: element, b: element) => element) => select(a, b);
}

/***
 * Select the first element of a pair
 * @param p: a pair constructed by pair()
 */
export function first(p: (s: (a: element, b: element) => element) => element): element
{
    return p((a, _) => a);
}

/***
 * Select the second element of a pair
 * @param p: a pair constructed by pair()
 */
export function second(p: (s: (a: element, b: element) => element) => element): element
{
    return p((_, b) => b);
}
