import {Element, emptyNode, first, isPair, pair, Pair, second} from "./chapter3_pair.ts";
import {Table} from "./chapter6_lookup_table.ts";

export type AstNode = Pair;
type Env = Table;

const varTypeTag = `var#${Math.random().toString()}`;
const funcTypeTag = `func#${Math.random().toString()}`;
const callTypeTag = `call#${Math.random().toString()}`;
const closureTypeTag = `closure#${Math.random().toString()}`;

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

export function func(name: string, body: AstNode) {
    return pair(funcTypeTag, pair(name, pair(body, emptyNode)));
}

export function isFunc(x: Element): boolean {
    if (!isPair(x)) {
        return false;
    }

    return first(x) == funcTypeTag;
}

export function funcParameter(x: AstNode): string {
    if (!isFunc(x)) {
        throw new Error(`not a function: ${x}`);
    }

    return first(second(x));
}

export function funcBody(x: AstNode): AstNode {
    if (!isFunc(x)) {
        throw new Error(`not a function: ${x}`);
    }

    return first(second(second(x)));
}

export function call(op: AstNode, arg: Element) {
    return pair(callTypeTag, pair(op, pair(arg, emptyNode)));
}

export function isCall(x: AstNode): boolean {
    if (!isPair(x)) {
        return false;
    }

    return first(x) == callTypeTag;
}

export function callOp(x: AstNode): AstNode {
    if (!isCall(x)) {
        throw new Error(`not a call: ${x}`);
    }

    return first(second(x));
}

export function callArg(x: AstNode): AstNode {
    if (!isCall(x)) {
        throw new Error(`not a call: ${x}`);
    }

    return first(second(second(x)));
}

export function closure(func: AstNode, env: Env) {
    return pair(closureTypeTag, pair(func, pair(env, emptyNode)));
}

export function isClosure(x: Element): boolean {
    if (!isPair(x)) {
        return false;
    }

    return first(x) == closureTypeTag;
}

export function closureFunc(x: AstNode): AstNode {
    if (!isClosure(x)) {
        throw new Error(`not a closure: ${x}`);
    }

    return first(second(x));
}

export function closureEnv(x: AstNode): Env {
    if (!isClosure(x)) {
        throw new Error(`not a closure: ${x}`);
    }

    return first(second(second(x)));
}
