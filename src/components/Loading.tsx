import Hero from "./Hero";

export const Loading: React.FC = ({ ...props }) => {
    return (
        <Hero {...props}>
            <h2>Loading...</h2>
        </Hero>
    );
};
