const translations = {
    en: {
        appTitle: "Balance Book",
        addPersonBtn: "+ Add Person",
        dashboardTitle: "Dashboard",
        totalGiven: "Total Given",
        totalReceived: "Total Received",
        totalPending: "Total Pending",
        totalPersons: "Number of Persons",
        purposeDistribution: "Purpose Distribution",
        monthlySummary: "Monthly Summary",
        personsList: "Persons List",
        searchName: "Search by name...",
        allPurposes: "All Purposes",
        purposeMarriage: "Marriage",
        purposeHouse: "House Construction",
        purposeLoan: "Loan",
        purposeWorkers: "Workers",
        purposeFunction: "Function",
        purposeMedical: "Medical",
        purposeOthers: "Others",
        addNewPerson: "Add New Person",
        nameLabel: "Name *",
        phoneLabel: "Phone (Optional)",
        purposeLabel: "Purpose *",
        savePersonBtn: "Save Person",
        backToDashboard: "Back",
        deletePersonBtn: "Delete Person",
        remainingBalance: "Remaining Balance",
        addTransaction: "Add Transaction",
        transType: "Type *",
        given: "Given",
        received: "Received",
        amount: "Amount *",
        date: "Date *",
        note: "Note",
        addBtn: "Add",
        transactionHistory: "Transaction History"
    },
    hi: {
        appTitle: "बैलेंस बुक",
        addPersonBtn: "+ व्यक्ति जोड़ें",
        dashboardTitle: "डैशबोर्ड",
        totalGiven: "कुल दिया गया",
        totalReceived: "कुल प्राप्त",
        totalPending: "कुल बाकी",
        totalPersons: "व्यक्तियों की संख्या",
        purposeDistribution: "उद्देश्य वितरण",
        monthlySummary: "मासिक सारांश",
        personsList: "व्यक्तियों की सूची",
        searchName: "नाम से खोजें...",
        allPurposes: "सभी उद्देश्य",
        purposeMarriage: "शादी",
        purposeHouse: "घर निर्माण",
        purposeLoan: "ऋण (लोन)",
        purposeWorkers: "मजदूर",
        purposeFunction: "समारोह",
        purposeMedical: "चिकित्सा",
        purposeOthers: "अन्य",
        addNewPerson: "नया व्यक्ति जोड़ें",
        nameLabel: "नाम *",
        phoneLabel: "फ़ोन (वैकल्पिक)",
        purposeLabel: "उद्देश्य *",
        savePersonBtn: "व्यक्ति सहेजें",
        backToDashboard: "वापस",
        deletePersonBtn: "व्यक्ति हटाएं",
        remainingBalance: "शेष राशि",
        addTransaction: "लेनदेन जोड़ें",
        transType: "प्रकार *",
        given: "दिया",
        received: "प्राप्त",
        amount: "राशि *",
        date: "दिनांक *",
        note: "विवरण",
        addBtn: "जोड़ें",
        transactionHistory: "लेनदेन इतिहास"
    },
    te: {
        appTitle: "బ్యాలెన్స్ బుక్",
        addPersonBtn: "+ వ్యక్తిని చేర్చండి",
        dashboardTitle: "డాష్బోర్డ్",
        totalGiven: "మొత్తం ఇచ్చినది",
        totalReceived: "మొత్తం పొందినది",
        totalPending: "మొత్తం బకాయి",
        totalPersons: "వ్యక్తుల సంఖ్య",
        purposeDistribution: "ప్రయోజనం పంపిణీ",
        monthlySummary: "నెలవారీ సారాంశం",
        personsList: "వ్యక్తుల జాబితా",
        searchName: "పేరు ద్వారా శోధించండి...",
        allPurposes: "అన్ని ప్రయోజనాలు",
        purposeMarriage: "వివాహం",
        purposeHouse: "ఇంటి నిర్మాణం",
        purposeLoan: "రుణం (లోన్)",
        purposeWorkers: "కార్మికులు",
        purposeFunction: "ఫంక్షన్",
        purposeMedical: "వైద్యం",
        purposeOthers: "ఇతరులు",
        addNewPerson: "కొత్త వ్యక్తిని చేర్చండి",
        nameLabel: "పేరు *",
        phoneLabel: "ఫోన్ (ఐచ్ఛికం)",
        purposeLabel: "ప్రయోజనం *",
        savePersonBtn: "వ్యక్తిని సేవ్ చేయండి",
        backToDashboard: "వెనుకకు",
        deletePersonBtn: "వ్యక్తిని తొలగించండి",
        remainingBalance: "మిగిలిన బ్యాలెన్స్",
        addTransaction: "లావాదేవీని చేర్చండి",
        transType: "రకం *",
        given: "ఇచ్చినది",
        received: "పొందినది",
        amount: "మొత్తం *",
        date: "తేదీ *",
        note: "గమనిక",
        addBtn: "చేర్చండి",
        transactionHistory: "లావాదేవీల చరిత్ర"
    }
};

function applyLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.setAttribute('placeholder', t[key]);
        }
    });
}

function initLanguage() {
    const savedLang = localStorage.getItem('balance_book_lang') || 'en';
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', (e) => {
            const selected = e.target.value;
            localStorage.setItem('balance_book_lang', selected);
            applyLanguage(selected);
        });
    }
    applyLanguage(savedLang);
}

document.addEventListener('DOMContentLoaded', initLanguage);
