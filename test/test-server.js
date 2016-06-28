var chai = require('chai');
var chaiHttp = require('chai-http');

global.environment = 'test';
var server = require('../server.js');
var Item = require('../models/item');
var seed = require('../db/seed');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
	before(function(done) {
		seed.run(function(){
			done();
		});
	});
	var id3 = '';

	it('should list items on get',function(done){
		chai.request(app).get('/items')
			.end(function(err,res){
				should.equal(err, null);
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.length.should.equal(3);
				res.body[0].should.be.a('object');
				res.body[0].should.have.property('_id');
				res.body[0].should.have.property('name');
				res.body[0]._id.should.be.a('string');
				res.body[0].name.should.be.a('string');
				res.body[0].name.should.equal('Broad Beans');
				res.body[1].name.should.equal('Tomatoes');
				res.body[2].name.should.equal('Peppers');
				done();
			});
	});
	it('should add an item on post',function(done){
		chai.request(app).post('/items')
			.send({'name':'Kale'})
			.end(function(err,res){ id3 = res.body._id;
				should.equal(err, null);
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('name');
				res.body.should.have.property('_id');
				res.body._id.should.be.a('string');
				res.body.name.should.be.a('string');
				res.body.name.should.equal('Kale');
				res.body._id.should.equal(id3);
			});
		chai.request(app).get('/items')
			.end(function(err, res) {
				res.body.should.be.a('array');
				res.body.length.should.equal(4);
				res.body[3].should.be.a('object');
				res.body[3].should.have.property('_id');
				res.body[3].should.have.property('name');
				res.body[3]._id.should.be.a('string');
				res.body[3].name.should.equal('Kale');
				res.body[3].name.should.be.a('string');
				done();
			});
	});
	it('should edit an item of put',function(done){
		chai.request(app).put('/items/' + id3)
			.send({'name':'Extra Healthy Kale','_id': id3})
			.end(function(err,res){
				should.equal(err, null);
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('name');
				res.body.should.have.property('_id');
				res.body._id.should.be.a('string');
				res.body._id.should.equal(id3);
				res.body.name.should.be.a('string');
				res.body.name.should.equal('Kale');
			});
		chai.request(app).get('/items')
			.end(function(err, res) {
				res.body.should.be.a('array');
				res.body.length.should.equal(4);
				res.body[3].should.be.a('object');
				res.body[3].should.have.property('_id');
				res.body[3].should.have.property('name');
				res.body[3]._id.should.be.a('string');
				res.body[3].name.should.equal('Extra Healthy Kale');
				res.body[3].name.should.be.a('string');
				done();
			});

	});
	it('should delete an item on delete',function(done){
		chai.request(app).delete('/items/' + id3)
			.end(function(err,res){
				should.equal(err, null);
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('name');
				res.body.should.have.property('_id');
				res.body._id.should.be.a('string');
				res.body.name.should.be.a('string');
				res.body.name.should.equal('Extra Healthy Kale');
			});
		chai.request(app).get('/items')
			.end(function(err, res) {
				should.equal(err, null);
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.length.should.equal(3);
				res.body[0].should.be.a('object');
				res.body[0].should.have.property('_id');
				res.body[0].should.have.property('name');
				res.body[0]._id.should.be.a('string');
				res.body[0].name.should.be.a('string');
				res.body[0].name.should.equal('Broad Beans');
				res.body[1].name.should.equal('Tomatoes');
				res.body[2].name.should.equal('Peppers');
				done();
			});

	});
	it('should add item on put if id does not exist',function(done){
		chai.request(app).put('/items/100')
			.send({'name':'Kale','_id':100})
			.end(function(err,res){
				should.equal(err, null);
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('name');
				res.body.should.have.property('_id');
				res.body._id.should.be.a('string');
				res.body.name.should.be.a('string');
				res.body.name.should.equal('Kale');
			});
		chai.request(app).get('/items')
			.end(function(err, res) {
				res.body.should.be.a('array');
				res.body.length.should.equal(4);
				res.body[3].should.be.a('object');
				res.body[3].should.have.property('_id');
				res.body[3].should.have.property('name');
				res.body[3]._id.should.be.a('string');
				res.body[3].name.should.equal('Kale');
				res.body[3].name.should.be.a('string');
				done();
			});

	});
	it('should not delete anything if id does not exist',function(done){
		chai.request(app).delete('/items/' + id3)
			.end(function(err,res){
				should.equal(err, null);
				res.should.have.status(200);
				res.should.be.json;
				//res.body.should.be.empty;
			});
		chai.request(app).get('/items')
			.end(function(err, res) {
				should.equal(err, null);
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.length.should.equal(4);
				res.body[0].should.be.a('object');
				res.body[0].should.have.property('_id');
				res.body[0].should.have.property('name');
				res.body[0]._id.should.be.a('string');
				res.body[0].name.should.be.a('string');
				res.body[0].name.should.equal('Broad Beans');
				res.body[1].name.should.equal('Tomatoes');
				res.body[2].name.should.equal('Peppers');
				done();
			});
	});
	
	
	
	after(function(done) {
		Item.remove(function() {
			done();
		});
	});
});
