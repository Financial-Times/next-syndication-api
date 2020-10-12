'use strict';

module.exports = exports = contentBuilder => {
	if (!('canAllGraphicsBeSyndicated' in contentBuilder)) {
		// Currently embeds can have more than one item for each picture - for different screen sizes
		// We are assuming that canBeSyndicated is the same for all sizes of a picture
		// We are asking if ALL Graphics can be syndicated, which means as long as at least one item
		// can't be, the answer to this is 'no'

		const { content } = contentBuilder;

		const atLeastOneGraphicCantBeShared =
			content.embeds &&
			content.embeds
				.filter(
					embed =>
						embed && embed.type && embed.type.endsWith('Graphic')
				)
				.some(item => item.canBeSyndicated !== 'yes');

		contentBuilder.canAllGraphicsBeSyndicated = !atLeastOneGraphicCantBeShared;
	}

	return contentBuilder.canAllGraphicsBeSyndicated || undefined;
};
