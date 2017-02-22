var koa = require('koa');
var router = require('koa-router')();
var app = koa();
var koabody = require('koa-body-parser');
var fs = require('fs');
var data = fs.readFileSync('test.json', 'utf-8');
var js_data = JSON.parse(data);
router.get('/', function *(next) {
	var html = "<table><tr><td>name</td><td>age</td></tr>";
    for (var i = 0; i < js_data.length; i++) {
		html += `<tr><td>${js_data[i].name}</td><td>${js_data[i].age}</td>
		<td><a href='/del/${js_data[i].id}'>del</a></td><td><a href="/update/${js_data[i].id}">update</a></td></tr>`;
	}
	html  += "<tr><td><a href='/create'>add</td></tr></table>";
	this.body = html;
 }).get('/stu/:id', function *(next) {
	var id = this.params.id;
	for (var i = 0; i < js_data.length; i++) {
		if (parseInt(id) == js_data[i].id) {
			this.body = `hello, everyone, my name is ${js_data[i].name}, andI' m ${js_data[i].age}`;
		} else {
			this.body = "this student doesn't in json";
		}
	}
}).get('/del/:id', function *(next) {
	var id = this.params.id;
	console.log(id);
	for (var i = 0; i < js_data.length; i++) {
		if (js_data[i].id == parseInt(id)) {
			js_data.splice(i, 1);
			console.log(JSON.stringify(js_data));
			fs.writeFile('test.json', JSON.stringify(js_data));
			this.redirect('/');
		}
	}
}).post('/add', function *(next) {
	console.log(this.request.body);
	var name = this.request.body.name;
	var age = this.request.body.age;
	var obj = {};
	if (js_data.length> 0 && (js_data[js_data.length-1].id != undefined))
		obj.id = js_data[js_data.length-1].id++;
	else 
		obj.id = '0';
	obj.age = age;
	obj.name = name;
	js_data[js_data.length] = obj;
	fs.writeFile('test.json', JSON.stringify(js_data));
	this.redirect('/');
}).get('/update/:id', function *(next) {
	var id = parseInt(this.params.id);
	var name, age;
	for (var i = 0; i < js_data.length; i++) {
		if (id == js_data[i].id) {
			name = js_data[i].name;
			age = js_data[i].age;
			this.body = `<form action="/change" method="post"><table><tr><input id="id" type="hidden" name="id" value="${id}"/><td>name</td><td><input type="text" id="name" name="name" value="${name}"/></td></tr><tr><td>age</td><td><input type="number" id="age" name="age" value="${age}"/></td></tr><tr><td><input type="submit" value="submit"/></td><td><input type="reset" value="reset"/></td></tr></table></form>`;
		}
	}
}).get('/create', function *(next) {
	this.body = `<form action="/add" method="post"><table><tr><td>name</td><td><input type="text" id="name" name="name"/></td></tr><tr><td>age</td><td><input type="number" id="age" name="age"/></td></tr><tr><td><input type="submit" value="submit"/></td><td><input type="reset" value="reset"/></td></tr></table></form>`;
}).post('/change', function *(next) {
	console.log(this.request.body)
	for (var i = 0; i < js_data.length; i++) {
		if (parseInt(this.request.body.id) == parseInt(js_data[i].id)) {
			js_data[i].name = this.request.body.name;
			js_data[i].age = this.request.body.age;
			break;
		}
	}
	fs.writeFile('test.json', JSON.stringify(js_data));
	this.redirect('/');
});
app
	.use(koabody())
	.use(router.routes())
	.use(router.allowedMethods());
app.listen(3000);
console.log('app started at port 3000...');
