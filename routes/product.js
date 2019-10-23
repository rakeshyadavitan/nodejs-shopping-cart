module.exports = {
	getHomePage: (req, res) => {
		var query = "select * from products order by id asc";
		// execute query
		db.query(query,(err, result) => {
			if (err){
				res.redirect('/home');
			};
			res.render('product.ejs',{ title: 'Welcome to Shopping kart', products: result});
		});
	}
};
