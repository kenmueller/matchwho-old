type ClientGameData =
	| { key: 'start' }
	| { key: 'question'; value: string }
	| { key: 'answer'; value: string }

export default ClientGameData
