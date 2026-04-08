export default interface Flange {
    id: number;
    name: string;
    imageUrl: string;
    properties: {
        diameter: number;
        thickness: number;
        material: string;
    };
}

