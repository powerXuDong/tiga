// import { stringify } from 'qs';

const HOST = "https://www.chengxudong.com/asia";

const pathMap: Record<string, string> = {
	'登录': '/login',
	'注册账户': '/register',

	'账户信息': '/userInfo',
	'选美列表': '/get/contestants/list',

	'投票': '/vote/:contestant_id',

	'获取OSS签名': '/oss/sign',
};

// 处理url上的参数
const _getUrl = function(api: string, pathParams: Record<string, string> = {}) {
	if (pathMap[api]) {
		let path = pathMap[api];

		for (const item in pathParams) {
      path = path.replace(`:${item}`, pathParams[item])
    };

		return HOST + path;
	};

	return HOST + decodeURIComponent(api);
}

const Request = async (option: any) => {
  const url = _getUrl(option.url, option.pathParams || {});
  delete option.url;

	const options = {
		method: 'GET',
    credentials: 'include',
		headers: {},
		...option,
	};

	if (option.method === 'POST') {
		options.body = JSON.stringify(option?.body || {});
		options.headers['Content-Type'] = 'application/json';
	};

	const token = localStorage.getItem('beauty_token');

	if (token) {
		options.headers['Authorization'] = `Bearer ${token}`;
	};

  return new Promise((resolve) => {
		fetch(url, options)
			.then(response => {
				if (response && [200, 201, 204, 304].indexOf(response.status) >= 0) {
					return response.json();
				};

				return {
					code: response.status,
					statusText: response.statusText || ''
				};
			})
			.then(data => {
				resolve(data);
			});
	});
}

export { Request, HOST };
