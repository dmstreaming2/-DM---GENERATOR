// gen-backend.js (versión compatible con tu interfaz)
(function() {
    'use strict';

    // Datos del formulario
    const state = {
        bin: '',
        month: '',
        year: '',
        ccv2: '',
        quantity: 10,
        dateEnabled: true,
        ccv2Enabled: true,
        creditCards: '',
        length: 16
    };

    // Referencias DOM
    const elements = {
        bin: document.getElementById('bin'),
        month: document.getElementById('month'),
        year: document.getElementById('year'),
        ccv2: document.getElementById('ccv2'),
        quantity: document.getElementById('quantity'),
        result: document.getElementById('result'),
        dateEnabled: document.getElementById('dateEnabled'),
        ccv2Enabled: document.getElementById('ccv2Enabled'),
        form: document.getElementById('generator-form'),
        loading: document.getElementById('loading')
    };

    // Funciones de generación
    function rand(min, max) {
        return min === 0 ? Math.floor(Math.random() * max) : Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function strrev(str) {
        return str.split('').reverse().join('');
    }

    function pad(num, size) {
        let s = '0' + num;
        return s.substr(s.length - size);
    }

    function makeCC() {
        let cc = '';
        state.bin.split('').forEach((digit, index) => {
            if (cc.length < state.length - 1) {
                cc += digit.toLowerCase() === 'x' ? rand(0, 9).toString() : digit.toString();
            }
        });

        let sum = 0;
        let reversed = strrev(cc);
        for (let i = 0; i < state.length - 1; i++) {
            let num = 2 * reversed[i];
            if (num > 9) num -= 9;
            sum += num;
            if (i !== state.length - 2) sum += parseInt(reversed[i + 1]);
            i++;
        }

        let checkDigit = (10 * (Math.floor(sum / 10) + 1) - sum) % 10;
        return cc + (isNaN(checkDigit) ? '' : checkDigit.toString());
    }

    function generateDate() {
        if (state.dateEnabled) {
            let month = state.month === '' ? pad(rand(1, 12), 2) : state.month;
            let year = state.year === '' ? parseInt(new Date().getFullYear()) + rand(2, 5) : state.year;
            state.creditCards += '|' + month + '|' + year;
        }
    }

    function generateCCV2() {
        if (state.ccv2Enabled) {
            if (state.ccv2) {
                state.creditCards += '|' + state.ccv2;
            } else {
                let ccv2 = rand(0, 9).toString() + rand(0, 9).toString() + rand(0, 9).toString();
                if (state.length === 15) ccv2 += rand(0, 9).toString();
                state.creditCards += '|' + ccv2;
            }
        }
    }

    function generate() {
        if (state.bin === '' || state.bin.length < 6) return;

        state.creditCards = '';
        let firstCard = '';

        for (let i = 0; i < state.quantity; i++) {
            state.creditCards += makeCC();
            if (i === 0) firstCard = state.creditCards;
            generateDate();
            generateCCV2();
            if (i < state.quantity - 1) state.creditCards += '\n';
        }

        // Mostrar resultado
        elements.result.value = state.creditCards;
        
        // Ocultar loading si existe
        if (elements.loading) {
            elements.loading.classList.remove('active');
        }
    }

    // Event Listeners
    elements.form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Mostrar loading si existe
        if (elements.loading) {
            elements.loading.classList.add('active');
        }

        // Simular delay para efecto visual
        setTimeout(function() {
            generate();
        }, 500);
    });

    elements.bin.addEventListener('blur', function(e) {
        if (e.target.value.length >= 6) {
            state.bin = e.target.value.replace(/\s+/g, '');
            state.length = /^3/.exec(state.bin) ? 15 : 16;
            state.bin = state.bin.replace(/X/g, 'x').replace(/[^0-9x]/g, '');
            
            let placeholder = '';
            for (let i = 0; i < state.length - state.bin.length; i++) {
                placeholder += 'x';
            }
            state.bin += placeholder;
            e.target.value = state.bin;
        }
    });

    elements.bin.addEventListener('input', function(e) {
        state.bin = e.target.value;
    });

    elements.month.addEventListener('change', function(e) {
        state.month = e.target.value;
    });

    elements.year.addEventListener('change', function(e) {
        state.year = e.target.value;
    });

    elements.ccv2.addEventListener('input', function(e) {
        state.ccv2 = e.target.value;
    });

    elements.quantity.addEventListener('input', function(e) {
        state.quantity = parseInt(e.target.value) || 10;
    });

    elements.dateEnabled.addEventListener('change', function(e) {
        state.dateEnabled = e.target.checked;
    });

    elements.ccv2Enabled.addEventListener('change', function(e) {
        state.ccv2Enabled = e.target.checked;
    });

    console.log('[DM Generator] Sistema inicializado correctamente');
})();