export default async function until(ms: number = 1000) {
    return new Promise((resolve) => setTimeout(() => {
        console.log(`awaited ${ms}`);
        resolve(ms);
    }, ms));
}
