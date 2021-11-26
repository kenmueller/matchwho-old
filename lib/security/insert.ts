const insertNonce = (page: string, nonce: string) =>
	page.replace(
		'<script type="module">',
		`<script type="module" nonce=${JSON.stringify(nonce)}>`
	)

export default insertNonce
