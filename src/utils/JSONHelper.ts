/* eslint-disable @typescript-eslint/no-explicit-any */

const types = {
    BigInt: 'bigint',
    Date: 'date',
} as const;

function replacer(this: any, k: string, v: any) {
    if (typeof v === 'bigint') {
        return { '@type': types.BigInt, value: v.toString() };
    }
    if (this[k] instanceof Date) {
        return { '@type': types.Date, value: v };
    }
    return v;
}

export function stringify(input: any) {
    return JSON.stringify(input, replacer);
}

export function parse(input: string | undefined) {
    if (!input) {
        return undefined;
    }
    return JSON.parse(input, (_, v) => {
        if (v) {
            switch (v['@type']) {
                case types.BigInt:
                    return BigInt(v.value);
                case types.Date:
                    return new Date(v.value);
                default:
                    return v;
            }
        }
        return v;
    });
}
