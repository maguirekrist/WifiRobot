

export function IsJSON(data: any): boolean {
    try {
        JSON.parse(data)
        return true;
    } catch(ex) {
        return false;
    }
}