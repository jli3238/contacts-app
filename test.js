console.log('a');
(async () => {
    for (let i = 0; i < 1000; ++i) {
        console.log('b');
    }
})();
console.log('c');