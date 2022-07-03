/**
 * `npm diff`/`libnpmdiff` outputs `new file` and `deleted file` with a/b as
 * the file name, while `git diff` output `+++ /dev/null` and `--- /dev/null`.
 *
 * This little utiltity finds any `new file` or `deleted file` and replaces the
 * file name with `/dev/null`.
 */
const adjustDiff = (content: string): string => {
    return (
        content
            // `npmdiff-parse` expects the `+++` to be `/dev/null` to detect as deleted.
            .replace(
                /(?<=deleted file mode \d{6}\nindex .*\.\..*\n--- .+\n\+\+\+ )b\/.+(?=\n)/g,
                "/dev/null",
            )
            // `npmdiff-parse` expects the `---` to be `/dev/null` to detect as added.
            .replace(
                /(?<=new file mode \d{6}\nindex .*\.\..*\n--- )a\/.+(?=\n\+\+\+ .+\n)/g,
                "/dev/null",
            )
    );
};

export default adjustDiff;
