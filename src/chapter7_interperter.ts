import {emptyNode, first, isPair, pair, Pair, second} from "./chapter3_pair.ts";

type AstNode = Pair;

const varTypeTag = `var#${Math.random().toString()}`;
const funcTypeTag = `func#${Math.random().toString()}`;
const callTypeTag = `call#${Math.random().toString()}`;

export function variable(name: string){
    return pair(varTypeTag, pair(name, emptyNode));
}

export function isVariable(x: AstNode): boolean {
    if (!isPair(x)) {
        return false;
    }

    return first(x) == varTypeTag;
}

export function variableName(x: AstNode): string {
    if (!isVariable(x)) {
        throw new Error(`not a variable: ${x}`);
    }

    return first(second(x));
}

