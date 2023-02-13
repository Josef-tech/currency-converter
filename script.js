window.addEventListener('load', function () {
    addEventListeners();
    setRates();
})



async function setRates() {
    const { leftSide, rightSide } = getCalculatorData();
    const { fromRate, toRate } = await getBothCurrencies(leftSide.currency, rightSide.currency);
    leftSide.wrapper.querySelector('.rate').innerHTML = fromRate;
    rightSide.wrapper.querySelector('.rate').innerHTML = toRate;

    leftSide.wrapper.querySelector('input').dispatchEvent(new Event('input', { bubbles: true }));
}

function addEventListeners() {
    document.querySelectorAll('input').forEach((input) => {
        input.addEventListener('input', (event) => {
            const wrappers = document.querySelectorAll('.wrap');
            const changedWrapper = event.composedPath().find((e) => e.classList.contains('wrap'));

            wrappers.forEach((w) => {
                if (changedWrapper !== w) {
                    const rate = +changedWrapper.querySelector('.rate').textContent;
                    w.querySelector('input').value = event.target.value * rate;
                }
            })
        })
    })

    function setButtonsListeners() {
        document.querySelectorAll('.currency').forEach((button) => {
            button.addEventListener('click', (event) => {
                const changedWrapper = event.composedPath().find((e) => e.classList.contains('wrap'));

                changedWrapper.querySelectorAll('.currency').forEach((button) => {
                    button.classList.remove('selected')
                })

                event.target.classList.add('selected');

                setRates();
            })
        })
    }

    setButtonsListeners();

    document.querySelector('.swap').addEventListener('click', function () {

        const [leftWrapper, rightWrapper] = document.querySelectorAll('.wrap');
        const leftButtons = leftWrapper.querySelector('.buttons');
        const rightButtons = rightWrapper.querySelector('.buttons');
        const leftButtonsClone = leftButtons.cloneNode(true);
        const rightButtonsClone = rightButtons.cloneNode(true);
        leftButtons.remove()
        rightButtons.remove()
        leftWrapper.prepend(rightButtonsClone)
        rightWrapper.prepend(leftButtonsClone)
        setButtonsListeners();
        setRates();
    })
}

function getCalculatorData() {
    const [leftWrap, rightWrap] = document.querySelectorAll('.wrap');

    return {
        leftSide: {
            currency: leftWrap.querySelector('.selected').textContent,
            amount: leftWrap.querySelector('input').value,
            wrapper: leftWrap,
        },
        rightSide: {
            currency: rightWrap.querySelector('.selected').textContent,
            amount: rightWrap.querySelector('input').value,
            wrapper: rightWrap,
        }
    }
}

async function getBothCurrencies(from, to) {
    const rate = await getCurrencyRate(from, to);

    return {
        fromRate: rate,
        toRate: 1 / rate,
    }
}

function getCurrencyRate(from, to) {
    return fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`)
        .then(res => res.json())
        .then(data => data.rates[to])
}






