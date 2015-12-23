import Store from 'store/Store'
import API from 'service/API'

export default new class extends Store {
	constructor() {
		super();
		this.state = {
			games: new Map()
		};
	}

	/**
	 * 自分の関連する全ゲームを取得する
	 * @return {Promise} 全ゲームの配列
	 */
	pGetAll() {
		return API.pGet('/game')
			.then(data => {
				if (data.status !== 200) return Promise.reject(data.result);

				const games = data.result.games
                    .map(formatGame);

				games.forEach(game => {
					this.state.plans.set(game.id, game);
				});
				this.dispatch();

				return games;
			});
	}

	/**
	 * ゲームを作成する
	 * @param  {string} userName 相手ユーザー名
	 * @return {Promise} 作成されたプラン
	 */
	pCreate(userName) {
		// return API.pPost(`/game?name=${userName}`, {})
		return Promise.resolve({
			status: 200,
			result: {
				game: {
					id: Math.random(),
					players: ['(you)', userName],
					turn: '1',
					created: Date.now(),
					updated: Date.now()
				}
			}
		})
			.then(data => {
				if (data.status !== 200) return Promise.reject(data.result);

				const game = formatGame(data.result.game);
				this.state.games.set(game.id, game);
				this.dispatch();

				return game;
			});
	}

	/**
	 * 手を打つ
	 * @param  {Object} game ゲーム
	 * @param  {number} x x
	 * @param  {number} y y
	 * @return {Promise} 更新されたゲームの状態
	 */
	pSetMove(game, x, y) {
		return API.pPost(`/game/${game.id}/move?x=${x}&y=${y}`, {})
			.then(data => {
				if (data.status !== 200) return Promise.reject(data.result);

				const game = formatGame(data.result.game);
				this.state.games.set(game.id, game);
				this.dispatch();

				return game;
			});
	}
}

/**
 * APIのレスポンスを整形する
 * @param {Object} data APIのレスポンス
 * @return {Object} 整形後のオブジェクト
 */
function formatGame(data) {
	return {
		id: data.id,
		players: data.players,
		turn: data.turn,
		created: data.created,
		updated: data.updated,
	};
}
