export const encodeData = (data: string) => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(data);
    return bytes;
}

export const decodeData = (byteArray: any[]) => {
    const bytes = Uint8Array.from(byteArray);
    const decoder = new TextDecoder();
    const decodedString = decoder.decode(bytes);
    return decodedString;
}

export const encode = (inputString: string) => {
    const encoder = new TextEncoder();

    const uint8Array = encoder.encode(inputString);

    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
        const byte = uint8Array[i];
        binaryString += byte.toString(2).padStart(8, '0');
    }
    return binaryString;
}

export const decode = (binary : string) => {
    let str = '';
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.slice(i, i + 8);
      str += String.fromCharCode(parseInt(byte, 2));
    }
    return str;
}