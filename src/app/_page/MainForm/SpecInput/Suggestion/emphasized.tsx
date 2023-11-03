const emphasized = (text = "NO_TEXT") => {
    return Array.from(
        text.matchAll(
            /(?<before>[^<]*)(?:<em>(?<em>[^<]*)<\/em>(?<after>[^<]*))?/g,
        ),
    )
        .map(({ groups: { before, em, after } = {} }, index) => [
            before,
            em && (
                <em className="not-italic underline" key={index}>
                    {em}
                </em>
            ),
            after,
        ])
        .flat();
};

export default emphasized;
