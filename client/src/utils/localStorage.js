export const saveBookIds = (bookArr) => {
    if (bookArr.length) {
        localStorage.setItem('saved_books', JSON.stringify(bookArr));
    } else {
        localStorage.removeItem('saved_books');
    }
};

export const getSavedBookIds = () => {
    const savedBookIds = localStorage.getItem('saved_books') ?
        JSON.parse(localStorage.getItem('saved_books')) :
        [];

    return savedBookIds;
};

export const bookRemoveId = (bookId) => {
     const savedBookIds = localStorage.getItem("saved_books")
        ? JSON.parse(localStorage.getItem("saved_books"))
        : null;

    if (!savedBookIds) {
        return false;
    }

    const updatedBookId = savedBookIds?.filter((savedBookId) => savedBookId !== bookId);
    localStorage.setItem("saved_books", JSON.stringify(updatedBookId));

    return true;
};