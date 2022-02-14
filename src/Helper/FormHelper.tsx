export const makeDropdownKey = (name: string) => {
    return name.toLowerCase().split(" ").join("-");
} 

export const makeDropdownObject = (dropArray : string[]) => {
    return dropArray.reduce((result: any, node: string) => {
        return result = [...result, {
            "key": makeDropdownKey(node),
            "text": node,
            "value": makeDropdownKey(node)
        }];
    },[])
}

 // const categoryOptions = [
    //     { key: 'architecture', text: 'Architecture', value: 'architecture' },
    //     { key: 'interior-design-and-decoration', text: 'Interior Design and Decoration', value: 'interior-design-and-decoration' },
    //     { key: 'outdoor-design', text: 'Outdoor Design', value: 'outdoor-design' },
    //     { key: 'other', text: 'Other', value: 'other' },
    // ];