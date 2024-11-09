export interface Book {
    isbn: string;
    title: string;
    genre: string;
    numberOfPages: number;
    numberOfCopies: number;
    available: boolean;
    authorIds: number[];
}