export type Element = any;
type PairVisitor = (a: Element, b: Element) => Element;
export type Pair = (s: PairVisitor) => Element;
export const emptyNode = pair(null, null);

/***
 * Construct a pair
 * @param a: first element
 * @param b: second element
 * @returns a function that takes a function that takes two elements and returns one element
 */
export function pair(a: Element, b: Element): Pair
{
    return (select: PairVisitor) => select(a, b);
}

/***
 * Select the first element of a pair
 * @param p: a pair constructed by pair()
 */
export function first(p: Pair): Element
{
    return p((a, _) => a);
}

/***
 * Select the second element of a pair
 * @param p: a pair constructed by pair()
 */
export function second(p: Pair): Element
{
    return p((_, b) => b);
}

/***
 * Check if the element is a pair
 * @param x
 */
export function isPair(x: Pair): boolean
{
    return x != emptyNode && typeof(x) == "function";
}

/***
 * Convert a pair to string
 * @param x
 */
export function pairToString(x: Pair): string {
    if (!isPair(x)){
        return x == emptyNode ? '#' : String(x);
    }
    else {
        const fst = pairToString(first(x));
        const snd = pairToString(second(x));
        return snd != '#' ? `${fst}, ${snd}` : fst;
    }
}
