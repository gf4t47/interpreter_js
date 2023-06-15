import {emptyNode, Pair} from "./chapter3_pair.ts";
import {
    AstNode,
    callArg,
    callOp, closure, closureEnv, closureFunc,
    funcBody,
    funcParameter,
    isCall, isClosure,
    isFunc,
    isVariable,
    variableName
} from "./chapter7_constructor.ts";
import {binopE1, binopE2, binopOp, calcOp, isBinOp} from "./chapter5_caculator.ts";
import {addTable, lookupTable, Table} from "./chapter6_lookup_table.ts";
import {listToString} from "./chapter3_list.ts";

export type Exp = Pair;
export type Env = Table;

export const emptyEnv = emptyNode;
export const lookupEnv = lookupTable;
export const extEnv = addTable;

export function expToString(exp: Exp | string | number): string {
    if (typeof (exp) === 'number' || typeof (exp) === 'string') {
        return String(exp);
    }

    if (isVariable(exp)) {
        return variableName(exp);
    }

    if (isFunc(exp)) {
        return `${funcParameter(exp)} => ${expToString(funcBody(exp))}`;
    }

    if (isCall(exp)) {
        const op = callOp(exp);
        const strOP = isFunc(op) ? `(${expToString(op)})` : expToString(op);
        return `${strOP}(${expToString(callArg(exp))})`;
    }

    if (isBinOp(exp)) {
        return `(${expToString(binopE1(exp))} ${binopOp(exp)} ${expToString(binopE2(exp))})`;
    }

    if (isClosure(exp)) {
        const f = closureFunc(exp);
        const env = closureEnv(exp);
        return `closure(${expToString(f)}, ${listToString(env)})`;
    }

    throw new Error(`illegal expression: ${listToString(exp)}`);
}

export function interpret(exp: Exp | string | number, env: Env): string | number | Exp {
    if (typeof (exp) === 'number' || typeof (exp) === 'string') {
        return exp;
    }

    if (isBinOp(exp)) {
        const op = binopOp(exp);
        const e1 = Number(interpret(binopE1(exp), env));
        const e2 = Number(interpret(binopE2(exp), env));
        return calcOp[op](e1, e2);
    }

    if (isVariable(exp)) {
        const key = variableName(exp);
        const val = lookupEnv(key, env);
        if (val == null) {
            throw new Error(`undefined variable: ${key}`);
        }

        return val;
    }

    if (isFunc(exp)) {
        return closure(exp, env);
    }

    if (isCall(exp)) {
        const operator = interpret(callOp(exp), env);
        const operand = interpret(callArg(exp), env);

        if (isFunc(operator)) {
            const newEnv = extEnv(funcParameter(operator as AstNode), operand, env);
            return interpret(funcBody(operator as AstNode), newEnv);
        }
        else if (isClosure(operator)) {
            const f = closureFunc(operator as AstNode);
            const newEnv = extEnv(funcParameter(f), operand, closureEnv(operator as AstNode));
            return interpret(funcBody(f), newEnv);
        }
        else {
            throw new Error(`illegal function call: ${expToString(exp)}`);
        }
    }

    throw new Error(`illegal expression: ${expToString(exp)}`);
}

export function interp(exp: Exp | string | number): string | number | Exp {
    return interpret(exp, emptyEnv);
}
