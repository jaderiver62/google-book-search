import React from "react";
// Adding mutations and queries
import { useQuery, useMutation } from "@apollo/react-hooks";
// Linking our mutations and queries
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import { removeBookId } from "../utils/localStorage";

import { Jumbotron, Container, CardColumns, Card, Button } from "react-bootstrap";


const SavedBooks = () => {
    const { loading, data } = useQuery(GET_ME);
    const [deleteBook] = useMutation(REMOVE_BOOK);
// Adding delete mutation
    let userData = data?.me || {};
// Deletes from the database using mongo _id value
    const handleDeleteBook = async (bookId) => {
        try {
            const { data } = await deleteBook({
                variables: { bookId: bookId }
            });

            userData = data.removeBook;
            removeBookId(bookId);
        } catch (err) {
            console.error(err);
        }
    };
  // if data isn't here yet, say so
    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <>
            <Jumbotron fluid className="text-light bg-dark">
                <Container>
                    <h1>Saved books</h1>
                </Container>
            </Jumbotron>
            <Container>
                <h2>
                    {userData.savedBooks.length
                        ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? "book" : "books"}:`
                        : "You have no saved books"}
                </h2>
                <CardColumns>
                    {userData.savedBooks.map((book) => {
                        return (
                            <Card key={book.bookId} border="dark">
                                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" /> : null}
                                <Card.Body>
                                    <Card.Title>{book.title}</Card.Title>
                                    <p className="small">Authors: {book.authors}</p>
                                    <Card.Text>{book.description}</Card.Text>
                                    <Button className="btn-block btn-danger" onClick={() => handleDeleteBook(book.bookId)}>
                                        Delete Book
                                    </Button>
                                </Card.Body>
                            </Card>
                        );
                    })}
                </CardColumns>
            </Container>
        </>
    );
};

export default SavedBooks;
