import Store from 'store/Store'
import API from 'service/API'

export default new class extends Store {
	constructor() {
		super();
		this.state = {
			games: new Map(),
			timerId: null
		};
	}

	startIntervalRequest(interval = 3000) {
		this.state.timerId = setTimeout(() => {
			this.pGetAll()
				.then(() => this.startIntervalRequest());
		}, interval);
	}

	stopIntervalRequest(interval = 3000) {
		clearTimeout(this.state.timerId);
		this.state.timerId = null;
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
					this.state.games.set(game.id, game);
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
		return API.pPost(`/game?name=${userName}`, {})
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

	/**
	 * メッセージを送る
	 * @param  {Object} game ゲーム
	 * @param  {string} text メッセージ
	 * @return {Promise} 結果
	 */
	pSendMessage(game, text) {
		return API.pPost(`/game/${game.id}/chat?text=${text}`, {})
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
		moves: data.moves,
		chats: data.chats.reverse()
	};
}
