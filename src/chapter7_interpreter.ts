import {emptyNode, Pair} from "./chapter3_pair.ts";
import {
    callArg,
    callOp,
    funcBody,
    funcParameter,
    isCall,
    isFunc,
    isVariable,
    variableName
} from "./chapter7_constructor.ts";
import {binopE1, binopE2, binopOp, calcOp, isBinOp} from "./chapter5_caculator.ts";
import {addTable, lookupTable, Table} from "./chapter6_lookup_table.ts";

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

    throw new Error(`illegal expression: ${exp}`);
}

export function interp(exp: Exp | string | number, env: Env): string | number {
    if (typeof (exp) === 'number' || typeof (exp) === 'string') {
        return exp;
    }

    if (isBinOp(exp)) {
        const op = binopOp(exp);
        const e1 = Number(interp(binopE1(exp), env));
        const e2 = Number(interp(binopE2(exp), env));
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
        throw new Error(`not a function: ${expToString(exp)}`);
    }

    if (isCall(exp)) {
        throw new Error(`not a function: ${expToString(exp)}`);
    }

    throw new Error(`illegal expression: ${exp}`);
}
