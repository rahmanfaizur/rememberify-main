// This utils.ts in any doc tends to store all kinds of random functions and anything is generally stored and isint organised!

export function random(len: number): string {
    const options = "qwertyuioplkmnkjhbbbvfgfdcxsaz"; // Set of characters
    const length = options.length; // Length of the options string
    let ans = "";

    for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * length); // Generate random index
        ans += options[randomIndex]; // Append the character at the random index
    }

    return ans; // Return the generated string
}
