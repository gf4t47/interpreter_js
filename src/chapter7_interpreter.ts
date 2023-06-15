import {Pair} from "./chapter3_pair.ts";
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
import {binopE1, binopE2, binopOp, isBinOp} from "./chapter5_caculator.ts";

type Exp = Pair;

export function expToString(exp: Exp): string {
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
