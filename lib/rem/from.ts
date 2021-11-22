let factor: number | null = null

/** Convert `rem` to `px`. */
const fromRem = (rem: number) =>
	rem *
	(factor ??= parseFloat(getComputedStyle(document.documentElement).fontSize))

export default fromRem
