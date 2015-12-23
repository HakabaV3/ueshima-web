import Store from 'store/Store'
import API from 'service/API'

export default new class extends Store {
	constructor() {
		super();
		let username = localStorage.getItem('username'),
			token = localStorage.getItem('token');

			console.log(username, token);
		if (username && token) {
			this.state = {
				users: new Map(),
				username: username
			};
			API.setToken(token);

		} else {
			this.state = {
				users: new Map(),
				username: null
			};
		}
	}

	/**
	 * 特定のユーザーを取得する
	 * @param  {string} id ユーザーID
	 * @return {Promise} 指定されたユーザー
	 */
	pCreate(name) {
		return API.pPost(`/user?name=${name}`, {})
			.then(data => {
				if (data.status !== 200) return Promise.reject(data.result);

				const user = formatUser(data.result.user);
				this.state.users.set(id, user);
				this.state.username = user.name;
				localStorage.setItem('username', user.name)
				localStorage.setItem('token', data.result.user.token);
				API.setToken(data.result.user.token);

				this.dispatch();

				return user;
			});
	}

	logOut() {
		API.clearToken();
		this.state = {
			users: new Map(),
			username: null
		};
		localStorage.removeItem('username'),
		localStorage.removeItem('token');

		this.dispatch();
	}
}

/**
 * APIのレスポンスを整形する
 * @param {Object} data APIのレスポンス
 * @return {Object} 整形後のオブジェクト
 */
function formatUser(data) {
	return {
		id: data.id,
		name: data.name,
		created: data.created,
		updated: data.updated,
	};
}
