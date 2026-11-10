
function buildLibraryReport(data) {

    // امانتها
    const loanCount = data.loans.length;


    // امانت‌های فعال
    function callbackFilterActive(loan) {
        return loan.returned === false;
    }
    const activeLoans = data.loans.filter(callbackFilterActive);
    const activeCount = activeLoans.length;


    const loanRows = buildLoanRows(data);


    // امانتهای تاخیری
    function callbackFilterOverdue(row) {
        return row.status === "overdue";
    }
    const overdueLoans = loanRows.filter(callbackFilterOverdue);
    const overdueCount = overdueLoans.length;


    // مجموع روزهای تاخیر
    function callbackReduceOverdueDays(total, loan) {
        return total + loan.overdueDays;
    }
    const totalOverdueDays = overdueLoans.reduce(callbackReduceOverdueDays, 0);


    //  امانتهایی که عضو پیدا نشد 
    function callbackFilterUnmatched(loan) {
        function callbackFindReader(reader) {
            return reader.id === loan.readerId;
        }
        return !data.readers.find(callbackFindReader);
    }
    const unmatchedReaderLoans = data.loans.filter(callbackFilterUnmatched);
    const unmatchedReaderLoanCount = unmatchedReaderLoans.length;


    // بیشترین تاخیر
    function callbackReduceMostOverdue(mostOverdueLoan, loan) {
        if (
            mostOverdueLoan === null ||
            loan.overdueDays > mostOverdueLoan.overdueDays
        ) {
            return loan;
        }

        return mostOverdueLoan;
    }
    const mostOverdueLoan = overdueLoans.reduce(
        callbackReduceMostOverdue,
        null
    )
    const mostOverdueLoanId = mostOverdueLoan
        ? mostOverdueLoan.loanId
        : null;


    function callbackMapReader(reader) {
        function callbackFilterReaderLoan(loan) {
            return loan.readerId === reader.id;
        }
        const readerLoans = data.loans.filter(callbackFilterReaderLoan);


        function callbackMapLoanId(loan) {
            return loan.id;
        }
        const readerLoanIds = readerLoans.map(callbackMapLoanId);


        function callbackFilterReaderRow(row) {
            return readerLoanIds.includes(row.loanId);
        }
        const readerOverdueLoans = overdueLoans.filter(callbackFilterReaderRow);

        const readerActiveLoans = readerLoans.filter(callbackFilterActive);

        const readerActiveCount = readerActiveLoans.length;

        const readerOverdueCount = readerOverdueLoans.length;

        const readerTotalOverdueDays = readerOverdueLoans.reduce(
            callbackReduceOverdueDays,
            0
        )


        return {
            readerId: reader.id,
            readerLabel: reader.profile.displayName,
            activeCount: readerActiveCount,
            overdueCount: readerOverdueCount,
            totalOverdueDays: readerTotalOverdueDays
        }
    }
    const byReader = data.readers.map(callbackMapReader);





    return {
        loanCount: loanCount,
        activeCount: activeCount,
        overdueCount: overdueCount,
        totalOverdueDays: totalOverdueDays,
        unmatchedReaderLoanCount: unmatchedReaderLoanCount,
        mostOverdueLoanId: mostOverdueLoanId,
        byReader: byReader
    }
}
console.log(buildLibraryReport(libraryData));