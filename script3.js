

function prepareReminderRequest(data, loanId) {
    function callbackFindLoan(loan) {
        return loan.id === loanId;
    }
    const loan = data.loans.find(callbackFindLoan);

    if (!loan) {
        return null;
    }
    if (loan.returned === true) {
        return null;
    }

    function callbackFindBook(book) {
        return book.id === loan.bookId;
    }
    const book = data.books.find(callbackFindBook);

    if (!book) {
        return null;
    }
    if (loan.elapsedDays <= book.policy.loanDays) {
        return null;
    }

    function callbackFindReader(reader) {
        return reader.id === loan.readerId;
    }
    const reader = data.readers.find(callbackFindReader);
    if (!reader) {
        return null;
    }
    if (!reader?.contact?.email) {
        return null;
    }
    return {
        ...loan,
        reminder: {
            ...loan.reminder,
            requested: true
        }
    }
}

console.log(prepareReminderRequest(libraryData, "L1"));