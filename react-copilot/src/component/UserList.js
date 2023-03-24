import React, { useState, useEffect } from "react";
import axios from "axios";

// create a react component named List
export const List = (props) => {
    const { items, onItemSelect } = props;
    const listItems = items.map((item) => {
        return (
            <li key={item.id} onClick={() => onItemSelect(item)}>
                - {item.name}
            </li>
        );
    });

    return <ul>{listItems}</ul>;
};


// create a react component named SelectedItem
export const SelectedItem = (props) => {
    const { item } = props;

    return (
        <div>
            <h4>Selected Item</h4>
            <p>{item?.name}</p>
        </div>
    );
};

export const AppList = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            const result = await axios(
                "https://jsonplaceholder.typicode.com/users"
            );

            setItems(result.data);
        };

        fetchItems();
    }, []);

    const onItemSelect = (item) => {
        setSelectedItem(item);
    };

    return (
        <div>
            <h2>Simple List</h2>
            <List items={items} onItemSelect={onItemSelect} />
            <SelectedItem item={selectedItem} />
        </div>
    );
};
