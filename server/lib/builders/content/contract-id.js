'use strict';

module.exports = exports = contentBuilder => {
	if (!('contractId' in contentBuilder)) {
		const { contract, content_history } = contentBuilder;

		if(contract){
			contentBuilder.contractId = contract.contract_id;
		} else if(content_history){
			contentBuilder.contractId = content_history.contract_id;
		}
	}

	return contentBuilder.contractId || undefined;
};
