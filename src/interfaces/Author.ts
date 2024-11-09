export interface AuthorFull {
    authorId: number;
    name: string;
    dateOfBirth: string;
    dateOfDeath: string;
}

export interface Author {
    name: string;
    dateOfBirth: string;
    dateOfDeath: string;
}

export interface AuthorBook {
    authorId: number;
    name: string;
}