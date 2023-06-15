import {describe, it} from "https://deno.land/std@0.191.0/testing/bdd.ts";
import {each} from "./test_utility.ts";
import {
    call, callArg, callOp,
    func,
    funcBody,
    funcParameter, isCall,
    isFunc,
    isVariable,
    variable,
    variableName
} from "../src/chapter7_constructor.ts";
import {assert, assertEquals} from "https://deno.land/std@0.191.0/testing/asserts.ts";
import {Pair, pairToString} from "../src/chapter3_pair.ts";
import {binop} from "../src/chapter5_caculator.ts";
import {treeEqual} from "../src/chapter4_tree.ts";

type AstNode = Pair;

describe('test construct variable', () => {
    each<string>(
        [
            null,
            '',
            'name',
            "longlonglong name"
        ].reduce((accu, input) => ({...accu, [`"${input}"`]: input}), {}),
        (input: string) => {
            const varNode = variable(input);
            assert(isVariable(varNode));

            const varName = variableName(varNode);
            assertEquals(varName, input);
        }
    )
});

describe('test construct func', () => {
    const funcData: Array<[string, AstNode]> = [
        ['x', variable('x')],
        ['x + x', binop('+', 2, 1)],
        ['x', binop('+', variable('x'), variable('x'))]
    ]
    each<[string, AstNode]>(
        funcData.reduce((accu, [para, body]) => ({...accu, [`func(${para})`]: [para, body]}), {}),
        ([para, body]: [string, AstNode]) => {
            const funcNode = func(para, body);
            assert(isFunc(funcNode));

            const fPara = funcParameter(funcNode);
            const fBody = funcBody(funcNode);

            assertEquals(fPara, para);
            assert(treeEqual(fBody, body));
        }
    )

    it('test nested func', () => {
        const body = binop('+', variable('x'), variable('y'));
        const layer1 = func('x', body);
        assert(isFunc(layer1));
        assertEquals(funcParameter(layer1), 'x');
        assert(treeEqual(funcBody(layer1), body));

        const layer2 = func('y', layer1);
        assert(isFunc(layer2));
        assertEquals(funcParameter(layer2), 'y');
        assert(treeEqual(funcBody(layer2), layer1));
    });
});

describe('test construct call', () => {
    const callData: Array<[AstNode, AstNode]> = [
        [variable('f'), variable('x')],
    ]
    each<[AstNode, AstNode]>(
        callData.reduce((accu, [op, arg]) => ({...accu, [`(${pairToString(op)})(${pairToString(arg)})`]: [op, arg]}), {}),
        ([op, arg]: [AstNode, AstNode]) => {
            const callNode = call(op, arg);
            assert(isCall(callNode));

            const cOp = callOp(callNode);
            assert(treeEqual(cOp, op));

            const cArg = callArg(callNode);
            assert(treeEqual(cArg, arg));
        }
    )

    it('test nested call', () => {
        const body = binop('+', variable('x'), variable('y'));
        const layer1 = func('x', body);
        const layer2 = func('y', layer1);
        const arg1 = 2;
        const arg2 = 3;
        const call1 = call(layer2, arg1);
        assert(isCall(call1));
        assert(treeEqual(callOp(call1), layer2));
        assert(treeEqual(callArg(call1), arg1));

        const call2 = call(call1, arg2);
        assert(isCall(call2));
        assertEquals(callOp(call2), call1);
        assert(treeEqual(callArg(call2), arg2));
    });
});
