document.addEventListener('DOMContentLoaded', function () {
    let form = document.getElementById('payroll');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let basicSalary = Number(document.getElementById('basic_salary').value);
        let benefits = Number(document.getElementById('benefits').value);

        let grossSalary = calculateGrossSalary(basicSalary, benefits);
        document.getElementById('gross_salary_result').textContent = grossSalary.toFixed(2);

        let nssf = calcNSSF(grossSalary);
        document.getElementById('nssf_result').textContent = nssf.toFixed(2);

        let nhdf = calcNHDF(grossSalary);
        document.getElementById('nhdf_result').textContent = nhdf.toFixed(2);

        let taxableIncome = calcTaxableIncome(grossSalary, nssf, nhdf);
        document.getElementById('taxable_income_result').textContent = taxableIncome.toFixed(2);

        let payee = calcPayee(taxableIncome);
        document.getElementById('payee_result').textContent = payee.toFixed(2);

        let nhif = calcNHIF(grossSalary);
        document.getElementById('nhif_result').textContent = nhif.toFixed(2);

        let netPay = calcNetSalary(grossSalary, nhif, nssf, nhdf, payee);
        document.getElementById('netpay_result').textContent = netPay.toFixed(2);
    });
});

function calculateGrossSalary(basicSalary, benefits) {
    return basicSalary + benefits;
}

function calcNSSF(grossSalary, rate = 0.06) {
    let nssfContribution = Math.min(grossSalary * rate, 18000);
    return nssfContribution;
}

function calcNHDF(grossSalary, rate = 0.015) {
    return grossSalary * rate;
}

function calcTaxableIncome(grossSalary, nssf, nhdf) {
    return grossSalary - (nssf + nhdf);
}

function calcPayee(taxableIncome) {
    let payee = 0;
    if (taxableIncome > 800000) {
        payee = 0.35 * (taxableIncome - 800000) + 80000 + 130000 + 35000;
    } else if (taxableIncome > 500000) {
        payee = 0.325 * (taxableIncome - 500000) + 46767 + 8333;
    } else if (taxableIncome > 323333) {
        payee = 0.3 * (taxableIncome - 323333) + 8333;
    } else if (taxableIncome > 24000) {
        payee = 0.25 * (taxableIncome - 24000);
    }
    return payee;
}

function calcNHIF(grossSalary) {
    const nhifTable = [
        [5999, 150],
        [7999, 300],
        [11999, 400],
        [14999, 500],
        [19999, 600],
        [24999, 750],
        [29999, 850],
        [34999, 900],
        [39999, 950],
        [44999, 1000],
        [49999, 1100],
        [59999, 1200],
        [69999, 1300],
        [79999, 1400],
        [89999, 1500],
        [99999, 1600],
    ];

    for (let i = 0; i < nhifTable.length; i++) {
        if (grossSalary <= nhifTable[i][0]) {
            return nhifTable[i][1];
        }
    }
    return 1700; // Default value for gross salary above 99999
}

function calcNetSalary(grossSalary, nhif, nssf, nhdf, payee) {
    return grossSalary - (nhif + nssf + nhdf + payee);
}
