import {it} from "https://deno.land/std@0.191.0/testing/bdd.ts";

export function each<T>(params: Record<string, T>, cb: (p: T) => void) {
    Object.keys(params).map(title => {
        it(title, () => { cb(params[title]) });
    });
}
