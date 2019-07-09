class APIFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	splitter(arg) {
		arg.split(',').join(' ');
	}

	filter() {
		//BUILD QUERY
		// 1) filtering
		const queryObj = { ...this.queryString };
		const excludedFields = [ 'page', 'sort', 'limit', 'fields' ];
		excludedFields.forEach((el) => delete queryObj[el]);

		// 1B) ADVANCED FILTERING
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}

	sort() {
		// 2) SORTING
		if (this.queryString.sort) {
			const sortBy = this.splitter(this.queryString.sort);
			console.log(sortBy);
			this.query = this.query.sort(sortBy);
		} else this.query = this.query.sort('-createdAt');

		return this;
	}

	limitFields() {
		// 3) FIELD LIMITING
		if (this.queryString.fields) {
			const fields = this.splitter(this.queryString.fields);
			this.query = this.query.select(fields);
		} else this.query = this.query.select('-__v');

		return this;
	}

	paginate() {
		// 4) PAGINATION
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 100;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}

module.exports = APIFeatures;
