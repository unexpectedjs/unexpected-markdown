var esprima = require('esprima');
var estraverse = require('estraverse');

function parse(obj) {
    if (typeof obj === 'function') {
        obj = '(' + obj.toString() + '());';
    } else {
        obj = '(function () {' + obj + '}());';
    }
    return esprima.parse(obj).body[0].expression.callee.body;
}

module.exports = function extractTopLevelVaríables(ast) {
    if (typeof ast !== 'object') {
        ast = parse(ast);
    }
    var isHoistedByVarName = {};
    var nestingLevel = 0;
    var topMostBlockAtNestingLevel = -1;
    estraverse.replace(ast, {
        enter: function (node, parent) {
            if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
                return this.skip();
            }
            nestingLevel += 1;
            if (node.type === 'BlockStatement' && node !== ast && topMostBlockAtNestingLevel === -1) {
                topMostBlockAtNestingLevel = nestingLevel;
            }
            var isInsideBlock = topMostBlockAtNestingLevel !== -1;

            if (node.type === 'VariableDeclaration') {
                if (node.kind === 'var' || !isInsideBlock) {
                    // node.kind === 'let' || node.kind === 'const'
                    return {
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'SequenceExpression',
                            expressions: node.declarations.map(function (declaration) {
                                // Find all identifiers in the LHS of each variable declaration
                                // and mark them for hoisting.
                                // The complexity is due to destructuring.
                                estraverse.traverse(declaration.id, {
                                    enter: function (node, parentNode) {
                                        if (node.type === 'Property') {
                                            // When converting a simple var with destructuring, this property must
                                            // apparently be set for the resulting ast to be serialized correctly,
                                            // eg. so it comes out as ({a = b} = {}) instead of ({a = b: a = b} = {})
                                            node.shorthand = true;
                                        }
                                        if (parentNode && parentNode.type === 'AssignmentPattern' && node === parentNode.right) {
                                            return this.skip();
                                        }
                                        if (node.type === 'Identifier') {
                                            isHoistedByVarName[node.name] = true;
                                        }
                                    }
                                });
                                return {
                                    type: 'AssignmentExpression',
                                    left: declaration.id,
                                    operator: '=',
                                    right: declaration.init,
                                    shorthand: true
                                };
                            })
                        }
                    };
                }
            }
        },
        leave: function (node) {
            if (topMostBlockAtNestingLevel === nestingLevel) {
                topMostBlockAtNestingLevel = -1;
            }
            nestingLevel -= 1;
        }
    });
    return {
        type: 'BlockStatement',
        body: Object.keys(isHoistedByVarName).map(function (varName) {
            return {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'Identifier',
                            name: varName
                        },
                        init: null
                    }
                ]
            };
        })
        .concat([
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    arguments: [],
                    callee: {
                        type: 'FunctionExpression',
                        params: [],
                        defaults: [],
                        body: ast
                    }
                }
            }
        ])
    };
};
