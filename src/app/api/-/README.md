# The `-` prefix

Our main endpoint `[...parts]` is a catch-all, but we still want to have other
endpoints, we nest our other endpoints under a `-` prefix.

-   `/api/example-package` is a valid request
-   `/api/versions` could try to match `versions` as a package name

So instead

-   `/api/-/versions` is a valid request
