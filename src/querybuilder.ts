import { timeline, query, searchBody, queryBool, queryMulti, queryMust, queryMustNot, queryShould, queryWild } from './types/query';

export function queryBuilder(queryBody: searchBody, timeline: timeline): query {

	const query: query = { size: 100, query: {} };
	const queryBool: queryBool = { bool: {} };
	const queryMulti: queryMulti = { multi_match: {} };
	const queryMust: queryMust = { must: [] };
	const queryMustNot: queryMustNot = { must_not: [] };
	const queryShould: queryShould = { should: [] };
	const queryWild: queryWild = { wildcard: {} };

	let isBoolQuery = false;
	let isMultiMatchQuery = false;
	const isWildQuery = false;

	// Define timeline
	() => queryMust.must.push(rTimeline(timeline));

	if (queryBody.quote.length > 0) {
		isBoolQuery = true;
		for (const quote of queryBody.quote) queryMust.must.push({
			term: {
				label_index: quote.value
			}
		});
	}
	//QUERY BY FILE TYPE
	if (queryBody.file.length > 0) {
		isBoolQuery = true;
		for (const file of queryBody.file) {
			const file_value = file.value;
			queryMust.must.push({
				match: {
					'file_properties.extension': file_value
				}
			});
		}
	}
	//QUERY BY DEPARTMENT
	if (queryBody.folder.length > 0) {
		isBoolQuery = true;
		for (const folder of queryBody.folder) {
			queryMust.must.push({
				term: {
					metadata: folder.value
				}
			});
		}
	}

	//QUERY WITH MUST_NOT ON LABEL AND METADATA
	if (queryBody.minus.length > 0) {
		isBoolQuery = true;
		for (const minus of queryBody.minus) queryMustNot.must_not.push({
			multi_match: {
				query: minus.value,
				fields: ['label_index', 'metadata']
			}
		});
	}

	// QUERY WITH WILDCARD
	if (queryBody.wildcard.length > 0) {
		queryMust.must.push({ wildcard: { label_index: { value: queryBody.wildcard[0].value } } });
	}

	//MULTIMATCH
	if (queryBody.general.length > 0) {
		let data = '';
		for (const searchterm of queryBody.general) {
			if (searchterm.value !== '') {
				if (!data) data = searchterm.value;
				else data += ' ' + searchterm.value;
			}
		}

		const general = {
			query: data,
			fields: ['label_index', 'metadata']
		};

		queryMulti.multi_match = general;

		if (isBoolQuery) {
			queryMust.must.push(queryMulti);
			if (queryShould.should.length !== 0) queryBool.bool = Object.assign(queryBool.bool, { minimum_should_match: 1 }); //testing this
		}
		else isMultiMatchQuery = true;
	}

	if (isBoolQuery) {
		if (queryMust.must.length > 0) queryBool.bool = Object.assign(queryBool.bool, queryMust);
		if (queryMustNot.must_not.length > 0) queryBool.bool = Object.assign(queryBool.bool, queryMustNot);
		if (queryShould.should.length > 0) queryBool.bool = Object.assign(queryBool.bool, queryShould);
		if (Object.getOwnPropertyNames(queryBool.bool).length > 0) query.query = Object.assign(query.query, queryBool);
	}
    
	if (isWildQuery) {
		if (Object.getOwnPropertyNames(queryWild.wildcard).length > 0) query.query = Object.assign(query, queryWild);
	}
	else if (isMultiMatchQuery) {
		if (Object.getOwnPropertyNames(queryMulti.multi_match).length > 0) query.query = Object.assign(query.query, queryMulti);
	}

	return query;
}

function rTimeline(timeline: timeline){
	const timezone = '+01:00';
	const date_gte = 'now-2y'; //"now-1d", "now-1y", "2020-11-18||/M"
	const date_lte = 'now';

	return {
		range: {
			'file_properties.mod': {
				time_zone: timezone,
				gte: timeline.start || date_gte,
				lte: timeline.end || date_lte
			}
		}
	};
}