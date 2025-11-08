export function cn(...inputs: Array<string | false | null | undefined | Record<string, boolean> | Array<string | false | null | undefined>>): string {
    const classes: string[] = []

    const add = (input: any) => {
        if (!input) return
        if (typeof input === 'string') {
            classes.push(input)
            return
        }
        if (Array.isArray(input)) {
            input.forEach(add)
            return
        }
        if (typeof input === 'object') {
            Object.keys(input).forEach((key) => {
                if ((input as Record<string, boolean>)[key]) classes.push(key)
            })
            return
        }
    }

    inputs.forEach(add)
    return classes.filter(Boolean).join(' ')
}
