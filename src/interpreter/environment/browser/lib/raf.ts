export interface IRafImplementationNamespace {
	requestAnimationFrame (callback: FrameRequestCallback): number;
	cancelAnimationFrame (handle: number): void;
}

/**
 * Returns an object containing the properties that are relevant to 'requestAnimationFrame' and 'requestIdleCallback'
 * @param {typeof window} global
 */
export function rafImplementation (global: typeof window): IRafImplementationNamespace {
	let lastTime = 0;

	const _requestAnimationFrame = function requestAnimationFrame (callback: FrameRequestCallback): number {

		const currTime = new Date().getTime();

		const timeToCall = Math.max(0, 16 - (currTime - lastTime));

		const id = global.setTimeout(function () {
			callback(currTime + timeToCall);
		}, timeToCall);

		lastTime = currTime + timeToCall;

		return id;

	};

	const _cancelAnimationFrame = function cancelAnimationFrame (id: number): void {
		clearTimeout(id);
	};

	return {
		requestAnimationFrame: _requestAnimationFrame,
		cancelAnimationFrame: _cancelAnimationFrame
	};

}