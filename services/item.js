var Item = require('../models/item');

exports.save = function(name, cb) {
	Item.create({ name: name }, function(err, item) {
		if(err) {
			cb(err);
			return;
		}
		cb(null, item);
	});
};

exports.list = function(cb) {
	Item.find(function(err, items) {
		if(err) {
			cb(err);
			return;
		}
		cb(null, items);
	});
};

exports.update = function(id, name, cb) {
	Item.findOneAndUpdate({ _id: id }, { name: name }, function(err, item) {
		if(err) {
			exports.save(name, cb);
			return;
		}
		cb(null, item);
	});
};

exports.del = function(id, cb) {
	Item.findOneAndRemove({ _id: id }, function(err, item) {
		if(err) {
			cb(err);
			return;
		}
		cb(null, item);
	});
};

