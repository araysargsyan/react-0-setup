export default async function until(ms: number = 1000, callBefore?: () => void) {
    callBefore?.();
    return new Promise((resolve) => setTimeout(() => {
        console.log(`awaited ${ms}`);
        resolve(ms);
    }, ms));
}
