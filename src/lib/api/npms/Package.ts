export interface PackageLinks {
    npm: string;
    homepage: string;
    repository: string;
    bugs: string;
}

export interface PackageAuthor {
    name: string;
}

export interface PackageUser {
    username: string;
    email: string;
}

export default interface Package {
    name: string;
    scope: string;
    version: string;
    description: string;
    keywords: string[];
    date: string;
    links: PackageLinks;
    author: PackageAuthor;
    publisher: PackageUser;
    maintainers: PackageUser[];
}
