export const eslintCustomRules = {
	rules: {
		'env-vars-uppercase': {
			create( context ) {
				return {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					MemberExpression( node ) {
						if ( node.object.name === 'process' && node.property.name === 'env' && node.parent.property && !/^[A-Z_]+$/.test( node.parent.property.name ) ) {
							context.report({
								node: node.parent.property,
								message: 'Environment variables should be in UPPER_CASE.',
							});
						}
					},
				};
			},
		},
	},
};
