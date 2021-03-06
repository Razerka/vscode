/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class VSBuffer {

	public static alloc(byteLength: number): VSBuffer {
		return new VSBuffer(Buffer.allocUnsafe(byteLength));
	}

	public static wrap(actual: Buffer): VSBuffer {
		return new VSBuffer(actual);
	}

	public static fromString(source: string): VSBuffer {
		return new VSBuffer(Buffer.from(source));
	}

	public static concat(buffers: VSBuffer[], totalLength?: number): VSBuffer {
		if (typeof totalLength === 'undefined') {
			totalLength = 0;
			for (let i = 0, len = buffers.length; i < len; i++) {
				totalLength += buffers[i].byteLength;
			}
		}

		const ret = VSBuffer.alloc(totalLength);
		let offset = 0;
		for (let i = 0, len = buffers.length; i < len; i++) {
			const element = buffers[i];
			ret.set(element, offset);
			offset += element.byteLength;
		}

		return ret;
	}

	private readonly _actual: Buffer;
	public readonly byteLength: number;

	private constructor(buffer: Buffer) {
		this._actual = buffer;
		this.byteLength = this._actual.byteLength;
	}

	public toBuffer(): Buffer {
		// TODO@Alex: deprecate this usage
		return this._actual;
	}

	public toString(): string {
		return this._actual.toString();
	}

	public slice(start?: number, end?: number): VSBuffer {
		return new VSBuffer(this._actual.slice(start, end));
	}

	public set(array: VSBuffer, offset?: number): void {
		this._actual.set(array._actual, offset);
	}

	public readUint32BE(offset: number): number {
		return readUint32BE(this._actual, offset);
	}

	public writeUint32BE(value: number, offset: number): void {
		writeUint32BE(this._actual, value, offset);
	}

	public readUint8(offset: number): number {
		return readUint8(this._actual, offset);
	}

	public writeUint8(value: number, offset: number): void {
		writeUint8(this._actual, value, offset);
	}

}

function readUint32BE(source: Uint8Array, offset: number): number {
	return (
		source[offset] * 2 ** 24
		+ source[offset + 1] * 2 ** 16
		+ source[offset + 2] * 2 ** 8
		+ source[offset + 3]
	);
}

function writeUint32BE(destination: Uint8Array, value: number, offset: number): void {
	destination[offset + 3] = value;
	value = value >>> 8;
	destination[offset + 2] = value;
	value = value >>> 8;
	destination[offset + 1] = value;
	value = value >>> 8;
	destination[offset] = value;
}

function readUint8(source: Uint8Array, offset: number): number {
	return source[offset];
}

function writeUint8(destination: Uint8Array, value: number, offset: number): void {
	destination[offset] = value;
}
