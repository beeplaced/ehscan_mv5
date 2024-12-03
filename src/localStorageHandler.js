// Keys and default values to initialize
const defaultStorageValues = {
    theme: 'light',
    language: 'en',
    userPreferences: {},
};
localStorage.clear();
let settings = JSON.parse(localStorage.getItem('settings')) || {
    darkmode: false,
    imagerepeat: 5,
    projectflow: true,
    lang: 'en',
    sortby: 'byscore'
};

if (!localStorage.getItem('settings')) localStorage.setItem('settings', JSON.stringify(settings));
localStorage.setItem('userId', 'user-123')
localStorage.setItem('tenant', 'demoData_mv5')

console.log(localStorage)

function isPhone() {
    const userAgent = navigator.userAgent.toLowerCase();
    console.log(userAgent)

    return /iphone|ipod|android|windows phone/.test(userAgent);
}

if (isPhone()) {
    console.log("You are on a phone.");
} else {
    console.log("You are not on a phone.");
}