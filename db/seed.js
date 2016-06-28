var Item = require('../models/item');

exports.run = function(cb) {
	Item.create(
		{ name: 'Broad Beans' },
		{ name: 'Tomatoes' },
		{ name: 'Peppers' },
		function(err, items) {
			if(err) {
				cb(err);
				return;
			}
			cb(null, items);
		}
	);
};

if (require.main === module) {
	require('./connect');
	exports.run(
		function(err) {
			if(err) {
				console.error(err);
				return;
			}
			var mongoose = require('mongoose');
			mongoose.disconnect();
		}
	);
}

