import { useCombobox } from "downshift";
import { NextPage } from "next";
import { useState } from "react";

export interface AutocompletePageProps {}

const items = ["apple", "banana", "orange", "grapefruit", "lemon"];

const AutocompletePage: NextPage<AutocompletePageProps> = (props, context) => {
    const [inputItems, setInputItems] = useState(items);
    const {
        getComboboxProps,
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        getToggleButtonProps,
        highlightedIndex,
        isOpen,
    } = useCombobox({
        items: inputItems,
        onInputValueChange: ({ inputValue = "" }) => {
            setInputItems(
                items.filter((item) =>
                    item.toLowerCase().startsWith(inputValue.toLowerCase()),
                ),
            );
        },
    });

    return (
        <>
            <label {...getLabelProps()}>Choose an element:</label>
            <div style={{}} {...getComboboxProps()}>
                <input {...getInputProps()} />
                <button
                    type="button"
                    {...getToggleButtonProps()}
                    aria-label="toggle-menu"
                >
                    &#8595;
                </button>
            </div>
            <ul {...getMenuProps()} style={{}}>
                {isOpen &&
                    inputItems.map((item, index) => (
                        <li
                            style={
                                highlightedIndex === index
                                    ? { backgroundColor: "#bde4ff" }
                                    : {}
                            }
                            key={`${item}${index}`}
                            {...getItemProps({ item, index })}
                        >
                            {item}
                        </li>
                    ))}
            </ul>
        </>
    );
};

export default AutocompletePage;
