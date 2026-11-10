

function buildLoanRows(data) {

    const { books, readers, loans } = data;

    function callBackMap(loan) {

        function findBook(book, bookId) {
            return book.id === bookId;
        }

        function callback(book) {
            return findBook(book, loan.bookId);
        }

        const book = books.find(callback)

        function findReader(reader, readerId) {
             return reader.id === readerId
        }
        function callbackFindReader(reader){
            return findReader(reader, loan.readerId)
        }
        const reader = readers.find(callbackFindReader)


        const emailLabel = reader?.contact?.email ? reader.contact.email : "ایمیل ثبت نشده";
        const readerLabel = reader?.profile?.displayName ? reader.profile.displayName : "عضو ناشناس"

        let status = "";
        let remainingDays = 0;
        let overdueDays = 0;
        
        if (loan.returned === true) {
            status = "returned";
            remainingDays = 0;
            overdueDays = 0;
        }else if (loan.elapsedDays <= book.policy.loanDays){
            status = "on-time";
            remainingDays = book.policy.loanDays - loan.elapsedDays;
            overdueDays = 0
        }else if(loan.elapsedDays > book.policy.loanDays){
            status = "overdue";
            overdueDays = loan.elapsedDays - book.policy.loanDays;
            remainingDays = 0
        }

        return {
            loanId: loan.id,
            bookTitle: book.title,
            readerLabel: readerLabel,
            emailLabel: emailLabel,
            status: status,
            remainingDays: remainingDays,
            overdueDays: overdueDays}
        }

    return loans.map(callBackMap);
}
console.log(buildLoanRows(libraryData));
