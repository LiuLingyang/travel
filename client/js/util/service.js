let fetch = require('../util/fetch');

let service = {

	get(data){
		return new Promise((resolve, reject) => {
		    resolve({
				destination:'市一医院',
				time:'2017-01-01 10:00:00'
			});
		});
		// return fetch('http://122.224.104.142:9913/rest/get',{
		// 	method:'GET',
		// 	mode: "no-cors",
		// 	data:data
		// });
	},

	search(data){
		return new Promise((resolve, reject) => {
		    resolve({
			    "bus": [
			      {
			        "duration": "4000",
			        "cost": "2.5",
			        "walking_distance": "500",
			        "distance": "4500",
			        "expedite": "50%",
			        "steps": [
			          {
			            "index": "1",
			            "type": "01",
			            "name": "28路(岳庙-欣欣)"
			          },
			          {
			            "index": "2",
			            "type": "02",
			            "name": "地铁四号线（湘湖-庐江）",
			            "origin": "钱江路",
			            "destination": "近江"
			          }
			        ]
			      }
			    ],
			    "self": [
			      {
			        "id": "201",
			        "duration": "4000",
			        "distance": "4500",
			        "expedite": "50%"
			      }
			    ],
			    "taxi": [
			      {
			        "duration": "4000",
			        "distance": "4500",
			        "taxi_cost": "18"
			      }
			    ]
			});
		});
		// return fetch('http://122.224.104.142:9913/rest/uuid',{
		// 	method:'POST',
		// 	mode: "no-cors",
		// 	data:data
		// });
	},

	confirm(data){
		return new Promise((resolve, reject) => {
		    resolve({
				
			});
		});
		// return fetch('http://122.224.104.142:9913/rest/verify/uuid',{
		// 	method:'POST',
		// 	mode: "no-cors",
		// 	data:data
		// });
	}

}

module.exports = service;